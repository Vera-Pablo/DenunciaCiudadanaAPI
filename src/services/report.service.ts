import { reportRepository } from "../repositories/report.repository.js";
import { prisma } from "../config/db.js";
import type { CreateReportInput } from "../schemas/report.schema.js";

class ReportService {
  async getAllReports(filters: {
    id_type?: number | undefined;
    id_status?: number | undefined;
  }) {
    return await reportRepository.findAll(filters);
  }

  async getReportById(id: number) {
    const report = await reportRepository.findById(id);
    if (!report) throw new Error("Report not found");
    return report;
  }

  async createReport(data: CreateReportInput) {
    const tracking_num = this.generateTrackingNum();

    const pendingStatus = await prisma.status.findUnique({
      where: { type_status: "pending" },
    });
    if (!pendingStatus)
      throw new Error("Default status 'pending' not found in database");

    return await reportRepository.create({
      ...data,
      tracking_num,
      id_status: pendingStatus.id_status,
      strike: data.strike || "N/A",
    });
  }

  private generateTrackingNum(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "REP-";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export const reportService = new ReportService();
