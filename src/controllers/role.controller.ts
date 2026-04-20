import type { Request, Response, NextFunction } from "express";
import { roleService } from "../services/role.service.js";
import { roleSchema } from "../schemas/role.schema.js";
import { idParamSchema } from "../schemas/common.schema.js";

class RoleController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await roleService.getAllRoles();
      res.status(200).json({ status: "success", data: roles });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const role = await roleService.getRoleById(id);
      res.status(200).json({ status: "success", data: role });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = roleSchema.parse(req.body);
      const newRole = await roleService.createRole(validated.type_role);
      res.status(201).json({ status: "success", data: newRole });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validated = roleSchema.parse(req.body);
      const updatedRole = await roleService.updateRole(id, validated.type_role);
      res.status(200).json({ status: "success", data: updatedRole });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      await roleService.deleteRole(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const roleController = new RoleController();
