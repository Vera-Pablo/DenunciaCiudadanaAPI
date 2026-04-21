import { prisma } from "../config/db.js";

class CommentRepository {
  async create(data: { id_report: number; id_user: number; text: string }) {
    return await prisma.comment.create({
      data,
      include: {
        user: { select: { name: true, role: true } },
      },
    });
  }

  async findByReportId(id_report: number) {
    return await prisma.comment.findMany({
      where: { id_report },
      orderBy: { date: "asc" },
      include: {
        user: { select: { name: true, role: true } },
      },
    });
  }
}

export const commentRepository = new CommentRepository();
