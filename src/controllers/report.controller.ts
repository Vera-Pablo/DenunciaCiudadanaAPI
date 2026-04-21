import type { Request, Response, NextFunction } from "express";
import { reportService } from "../services/report.service.js";
import { createReportSchema, reportQuerySchema } from "../schemas/report.schema.js";
import { idParamSchema } from "../schemas/common.schema.js";

class ReportController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = reportQuerySchema.parse(req.query);
      const reports = await reportService.getAllReports(filters);
      res.status(200).json({ status: "success", data: reports });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const report = await reportService.getReportById(id);
      res.status(200).json({ status: "success", data: report });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createReportSchema.parse(req.body);
      const newReport = await reportService.createReport(validated);
      res.status(201).json({ status: "success", data: newReport });
    } catch (error) {
      next(error);
    }
  }
}

export const reportController = new ReportController();
