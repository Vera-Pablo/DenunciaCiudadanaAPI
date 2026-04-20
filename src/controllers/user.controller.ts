import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import { idParamSchema } from "../schemas/common.schema.js";

class UserController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      const sanitized = users.map(({ password, ...rest }: any) => rest);
      res.status(200).json({ status: "success", data: sanitized });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const user = await userService.getUserById(id);
      const { password, ...sanitized } = user;
      res.status(200).json({ status: "success", data: sanitized });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createUserSchema.parse(req.body);
      const newUser = await userService.createUser(validated);
      const { password, ...sanitized } = newUser;
      res.status(201).json({ status: "success", data: sanitized });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validated = updateUserSchema.parse(req.body);
      const updatedUser = await userService.updateUser(id, validated);
      const { password, ...sanitized } = updatedUser;
      res.status(200).json({ status: "success", data: sanitized });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
