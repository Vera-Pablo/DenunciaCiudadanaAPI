import type { Request, Response, NextFunction } from "express";
import { statusService } from "../services/status.service.js";
import { statusSchema } from "../schemas/status.schema.js";
import { idParamSchema } from "../schemas/common.schema.js";

class StatusController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const statuses = await statusService.getAllStatuses();
      res.status(200).json({ status: "success", data: statuses });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const status = await statusService.getStatusById(id);
      res.status(200).json({ status: "success", data: status });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = statusSchema.parse(req.body);
      const newStatus = await statusService.createStatus(validated.type_status);
      res.status(201).json({ status: "success", data: newStatus });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validated = statusSchema.parse(req.body);
      const updatedStatus = await statusService.updateStatus(id, validated.type_status);
      res.status(200).json({ status: "success", data: updatedStatus });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      await statusService.deleteStatus(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const statusController = new StatusController();
