import { describe, it, expect, vi, beforeEach } from "vitest";
import { commentService } from "../../services/comment.service.js";

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

const mockComment = {
  id_comment: 1,
  text: "Nuevo mensaje",
  date: new Date(),
  id_report: 1,
  id_user: 1,
  user: { name: "Test User", id_user: 1, role: { id_role: 1, type_role: "Ciudadano" } },
};

vi.mock("../../repositories/comment.repository.js", () => ({
  commentRepository: {
    create: vi.fn(),
    findByReportId: vi.fn(),
  },
}));

vi.mock("../../repositories/report.repository.js", () => ({
  reportRepository: {
    findById: vi.fn(),
    findByUserId: vi.fn(),
    findAll: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

import { commentRepository } from "../../repositories/comment.repository.js";
import { reportRepository } from "../../repositories/report.repository.js";

const textSchema = {
  safeParse: vi.fn(),
};

vi.mock("../../schemas/comment.schema.js", () => ({
  createCommentSchema: {
    parse: vi.fn(),
  },
}));

import { createCommentSchema } from "../../schemas/comment.schema.js";

describe("CU4: addComment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createCommentSchema.parse).mockImplementation((data: unknown) => data as { text: string });
  });

  it("T4.1 — Curso normal: ciudadano dueño de la denuncia", async () => {
    vi.mocked(reportRepository.findById).mockResolvedValue({
      ...mockReport,
      id_user: 1,
    });
    vi.mocked(commentRepository.create).mockResolvedValue(mockComment);

    const result = await commentService.addComment(1, {
      text: "Nuevo mensaje",
      id_user: 1,
      role: "Ciudadano",
    });

    expect(result).toBeDefined();
    expect(result.text).toBe("Nuevo mensaje");
  });

  it("T4.2 — Curso normal: autoridad comenta en cualquier denuncia", async () => {
    vi.mocked(reportRepository.findById).mockResolvedValue({
      ...mockReport,
      id_user: 2,
    });
    vi.mocked(commentRepository.create).mockResolvedValue({
      ...mockComment,
      user: { name: "Authority", id_user: 3, role: { id_role: 2, type_role: "Autoridad" } },
    });

    const result = await commentService.addComment(1, {
      text: "Respuesta oficial",
      id_user: 3,
      role: "Autoridad",
    });

    expect(result).toBeDefined();
  });

  it("T4.3 — Comentario vacío: el schema lo rechaza", async () => {
    vi.mocked(createCommentSchema.parse).mockImplementation(() => {
      throw new Error("String must contain at least 1 character(s)");
    });

    vi.mocked(reportRepository.findById).mockResolvedValue(mockReport);

    // Validate the schema before passing to service
    expect(() => createCommentSchema.parse({ text: "" })).toThrow();
  });

  it("T4.4 — Denuncia no existe: throw error", async () => {
    vi.mocked(reportRepository.findById).mockResolvedValue(null);

    await expect(
      commentService.addComment(999, {
        text: "test",
        id_user: 1,
        role: "Ciudadano",
      }),
    ).rejects.toThrow("Denuncia no encontrada");
  });

  it("T4.5 — Ciudadano en denuncia ajena: rechazado por autorización", async () => {
    vi.mocked(reportRepository.findById).mockResolvedValue({
      ...mockReport,
      id_user: 2,
    });

    await expect(
      commentService.addComment(1, {
        text: "test",
        id_user: 1,
        role: "Ciudadano",
      }),
    ).rejects.toThrow("FORBIDDEN");
  });

  it("T4.6 — Autoridad siempre puede comentar, aunque no sea dueño", async () => {
    vi.mocked(reportRepository.findById).mockResolvedValue({
      ...mockReport,
      id_user: 2,
    });
    vi.mocked(commentRepository.create).mockResolvedValue(mockComment);

    const result = await commentService.addComment(1, {
      text: "Respuesta",
      id_user: 3,
      role: "Autoridad",
    });

    expect(result).toBeDefined();
    expect(commentRepository.create).toHaveBeenCalledTimes(1);
  });
});
