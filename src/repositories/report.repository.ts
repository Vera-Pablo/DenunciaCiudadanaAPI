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
        user: { select: { name: true, email: true } },
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

  async updateStatus(id: number, id_status: number) {
    return await prisma.report.update({
      where: { id_report: id },
      data: { status: { connect: { id_status } } },
      include: {
        status: true,
        type: true,
        user: { select: { name: true, email: true } },
      },
    });
  }

  async findByUserId(userId: number) {
    return await prisma.report.findMany({
      where: { id_user: userId },
      include: {
        type: true,
        status: true,
      },
      orderBy: { date: "desc" },
    });
  }
}

export const reportRepository = new ReportRepository();
