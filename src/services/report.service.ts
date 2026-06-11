import { reportRepository } from "../repositories/report.repository.js";
import { prisma } from "../config/db.js";
import {
  createReportSchema,
  type CreateReportInput,
  type UpdateReportStatusInput,
} from "../schemas/report.schema.js";
import { commentRepository } from "../repositories/comment.repository.js";
import { emailService } from "./email.service.js";

class ReportService {
  async getAllReports(filters: {
    id_type?: number | undefined;
    id_status?: number | undefined;
  }) {
    return await reportRepository.findAll(filters);
  }

  async getReportById(id: number) {
    const report = await reportRepository.findById(id);
    if (!report) throw new Error("Denuncia no encontrada");
    return report;
  }

  async createReport(data: CreateReportInput & { id_user: number }) {
    createReportSchema.parse(data);
    if (!data.id_user) throw new Error("Usuario no autenticado");

    const tracking_num = this.generateTrackingNum();

    const pendingStatus = await prisma.status.findUnique({
      where: { type_status: "Pendiente" },
    });
    if (!pendingStatus)
      throw new Error("Estado por defecto 'Pendiente' no encontrado");

    const { id_type, id_user, ...rest } = data;

    return await reportRepository.create({
      ...rest,
      tracking_num,
      status: { connect: { id_status: pendingStatus.id_status } },
      type: { connect: { id_type } },
      user: { connect: { id_user } },
    });
  }

  async updateReportStatus(
    id: number,
    data: UpdateReportStatusInput,
    authorityId: number,
  ) {
    const report = await reportRepository.findById(id);
    if (!report) throw new Error("Denuncia no encontrada");

    const statusObj = await prisma.status.findUnique({
      where: { id_status: data.id_status },
    });
    if (!statusObj) throw new Error("Estado no encontrado");

    const updatedReport = await reportRepository.updateStatus(
      id,
      data.id_status,
    );

    if (data.resolution_text) {
      await commentRepository.create({
        id_report: id,
        id_user: authorityId,
        text: `[RESPUESTA OFICIAL] ${data.resolution_text}`,
      });
    }

    if (updatedReport.user.email) {
      await emailService.sendStatusUpdateNotification(
        updatedReport.user.email,
        updatedReport.tracking_num,
        statusObj.type_status,
      );
    }

    return updatedReport;
  }

  private generateTrackingNum(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "REP-";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async getStats() {
    const reports = await reportRepository.getStatsData();

    const total = reports.length;
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};

    for (const r of reports) {
      byStatus[r.status.type_status] = (byStatus[r.status.type_status] || 0) + 1;
      byType[r.type.type] = (byType[r.type.type] || 0) + 1;
    }

    return { total, byStatus, byType };
  }

  async getReportsByUser(userId: number) {
    return await reportRepository.findByUserId(userId);
  }
}

export const reportService = new ReportService();
