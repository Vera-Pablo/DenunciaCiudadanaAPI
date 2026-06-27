import { commentRepository } from "../repositories/comment.repository.js";
import { reportRepository } from "../repositories/report.repository.js";
import type { CreateCommentInput } from "../schemas/comment.schema.js";

class CommentService {
  async addComment(id_report: number, data: CreateCommentInput, userId: number, role: string) {
    const report = await reportRepository.findById(id_report);
    if (!report) throw new Error("Denuncia no encontrada");

    if (role !== "Autoridad" && report.id_user !== userId) {
      throw new Error("FORBIDDEN");
    }
    return await commentRepository.create({
      id_report,
      id_user: userId,
      text: data.text,
    });
  }

  async getCommentsByReport(id_report: number) {
    const report = await reportRepository.findById(id_report);
    if (!report) throw new Error("Denuncia no encontrada");

    return await commentRepository.findByReportId(id_report);
  }
}

export const commentService = new CommentService();
