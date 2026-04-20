import type { Request, Response, NextFunction } from "express";
import { typeService } from "../services/type.service.js";
import { typeSchema } from "../schemas/type.schema.js";
import { idParamSchema } from "../schemas/common.schema.js";

class TypeController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const types = await typeService.getAllTypes();
      res.status(200).json({ status: "success", data: types });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const type = await typeService.getTypeById(id);
      res.status(200).json({ status: "success", data: type });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = typeSchema.parse(req.body);
      const newType = await typeService.createType(validated.type);
      res.status(201).json({ status: "success", data: newType });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validated = typeSchema.parse(req.body);
      const updatedType = await typeService.updateType(id, validated.type);
      res.status(200).json({ status: "success", data: updatedType });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      await typeService.deleteType(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const typeController = new TypeController();
