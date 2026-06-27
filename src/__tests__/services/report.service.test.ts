import { describe, it, expect, vi, beforeEach } from "vitest";
import { reportService } from "../../services/report.service.js";

const mockReport = {
  id_report: 1,
  tracking_num: "REP-ABC123",
  description: "Test description",
  street: "Av. Siempre Viva",
  street_number: 742,
  img_url: null,
  date: new Date(),
  id_type: 1,
  id_status: 1,
  id_user: 1,
  type: { id_type: 1, type: "Vandalismo" },
  status: { id_status: 1, type_status: "Pendiente" },
  user: { name: "Test User", email: "test@test.com" },
  comments: [],
};

const mockReports = [mockReport, { ...mockReport, id_report: 2 }];

vi.mock("../../repositories/report.repository.js", () => ({
  reportRepository: {
    create: vi.fn(),
    findByUserId: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

vi.mock("../../config/db.js", () => ({
  prisma: {
    status: {
      findUnique: vi.fn(),
    },
  },
}));

const { parse } = vi.hoisted(() => ({
  parse: vi.fn<(data: any) => any>(),
}));

vi.mock("../../schemas/report.schema.js", () => ({
  createReportSchema: {
    parse,
  },
}));

import { reportRepository } from "../../repositories/report.repository.js";
import { prisma } from "../../config/db.js";

describe("CU1: createReport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    parse.mockImplementation((data) => data);
  });

  it("T1.1 — Curso normal: todos los campos completos, usuario autenticado", async () => {
    vi.mocked(prisma.status.findUnique).mockResolvedValue({
      id_status: 1,
      type_status: "Pendiente",
    });
    vi.mocked(reportRepository.create).mockResolvedValue(mockReport);

    const result = await reportService.createReport(
      {
        id_type: 1,
        description: "Test description",
        street: "Av. Siempre Viva",
        street_number: 742,
      },
      1,
    );

    expect(result).toBeDefined();
    expect(result).toHaveProperty("tracking_num");
    expect(result.tracking_num).toMatch(/^REP-/);
    expect(reportRepository.create).toHaveBeenCalledTimes(1);
  });

  it("T1.2 — Campos vacíos: falta description", async () => {
    parse.mockImplementation(() => {
      throw new Error("debe tener al menos 10 caracteres");
    });

    await expect(
      reportService.createReport(
        {
          id_type: 1,
          description: "abc",
          street: "Av. Siempre Viva",
          street_number: 742,
        },
        1,
      ),
    ).rejects.toThrow("debe tener al menos 10 caracteres");
  });

  it("T1.3 — Alternativo sin imagen: se crea igual", async () => {
    vi.mocked(prisma.status.findUnique).mockResolvedValue({
      id_status: 1,
      type_status: "Pendiente",
    });
    vi.mocked(reportRepository.create).mockResolvedValue({
      ...mockReport,
      img_url: null,
    });

    const result = await reportService.createReport(
      {
        id_type: 1,
        description: "Descripción válida de más de 10 caracteres",
        street: "Av. Siempre Viva",
        street_number: 742,
      },
      1,
    );

    expect(result).toBeDefined();
    expect(result.img_url).toBeNull();
  });

  it("T1.4 — No autenticado: el service no recibe id_user", async () => {
    await expect(
      reportService.createReport(
        {
          id_type: 1,
          description: "Descripción válida larga",
          street: "Av. Siempre Viva",
          street_number: 742,
        },
        undefined as unknown as number,
      ),
    ).rejects.toThrow("Usuario no autenticado");
  });

  it("T1.5 — Error DB: repository.create falla", async () => {
    vi.mocked(prisma.status.findUnique).mockResolvedValue({
      id_status: 1,
      type_status: "Pendiente",
    });
    vi.mocked(reportRepository.create).mockRejectedValue(
      new Error("Database error"),
    );

    await expect(
      reportService.createReport(
        {
          id_type: 1,
          description: "Descripción válida para el test",
          street: "Av. Siempre Viva",
          street_number: 742,
        },
        1,
      ),
    ).rejects.toThrow("Database error");
  });
});

describe("CU2: getReportsByUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("T2.1 — Curso normal: usuario tiene denuncias", async () => {
    vi.mocked(reportRepository.findByUserId).mockResolvedValue(mockReports);

    const result = await reportService.getReportsByUser(1);

    expect(result).toHaveLength(2);
    expect(reportRepository.findByUserId).toHaveBeenCalledWith(1);
  });

  it("T2.2 — Sin denuncias: usuario nuevo", async () => {
    vi.mocked(reportRepository.findByUserId).mockResolvedValue([]);

    const result = await reportService.getReportsByUser(99);

    expect(result).toEqual([]);
  });

  it("T2.3 — Usuario no existe: el repositorio devuelve vacío", async () => {
    vi.mocked(reportRepository.findByUserId).mockResolvedValue([]);

    const result = await reportService.getReportsByUser(-1);

    expect(result).toEqual([]);
  });
});

describe("CU3: getAllReports", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("T3.1 — Curso normal: sin filtros devuelve todas", async () => {
    vi.mocked(reportRepository.findAll).mockResolvedValue(mockReports);

    const result = await reportService.getAllReports({});

    expect(result).toHaveLength(2);
    expect(reportRepository.findAll).toHaveBeenCalledWith({});
  });

  it("T3.2 — Filtrar por estado", async () => {
    vi.mocked(reportRepository.findAll).mockResolvedValue([mockReport]);

    const result = await reportService.getAllReports({ id_status: 1 });

    expect(result).toHaveLength(1);
    expect(reportRepository.findAll).toHaveBeenCalledWith({ id_status: 1 });
  });

  it("T3.3 — Filtrar por tipo", async () => {
    vi.mocked(reportRepository.findAll).mockResolvedValue([mockReport]);

    const result = await reportService.getAllReports({ id_type: 2 });

    expect(result).toHaveLength(1);
    expect(reportRepository.findAll).toHaveBeenCalledWith({ id_type: 2 });
  });

  it("T3.4 — Sin denuncias: BD vacía", async () => {
    vi.mocked(reportRepository.findAll).mockResolvedValue([]);

    const result = await reportService.getAllReports({});

    expect(result).toEqual([]);
  });

  it("T3.5 — Filtros combinados", async () => {
    vi.mocked(reportRepository.findAll).mockResolvedValue([]);

    const result = await reportService.getAllReports({
      id_status: 1,
      id_type: 2,
    });

    expect(result).toEqual([]);
    expect(reportRepository.findAll).toHaveBeenCalledWith({
      id_status: 1,
      id_type: 2,
    });
  });

  it("T3.6 — Sin filtros, array vacío", async () => {
    vi.mocked(reportRepository.findAll).mockResolvedValue([]);

    const result = await reportService.getAllReports({});

    expect(Array.isArray(result)).toBe(true);
  });
});
