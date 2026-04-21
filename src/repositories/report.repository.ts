import { prisma } from "../config/db.js";

class ReportRepository {
  async create(data: any) {
    return await prisma.report.create({
      data,
      include: {
        type: true,
        status: true,
        user: { select: { name: true, email: true } },
      },
    });
  }

  async findAll(filters: { id_type?: number | undefined; id_status?: number | undefined }) {
    return await prisma.report.findMany({
      where: {
        AND: [
          filters.id_type ? { id_type: filters.id_type } : {},
          filters.id_status ? { id_status: filters.id_status } : {},
        ],
      },
      include: {
        type: true,
        status: true,
      },
    });
  }

  async findById(id: number) {
    return await prisma.report.findUnique({
      where: { id_report: id },
      include: {
        type: true,
        status: true,
        user: { select: { name: true, email: true } },
      },
    });
  }
}

export const reportRepository = new ReportRepository();
