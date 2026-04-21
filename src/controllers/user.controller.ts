import type { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import { idParamSchema } from "../schemas/common.schema.js";

class UserController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ status: "success", data: users });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const user = await userService.getUserById(id);
      res.status(200).json({ status: "success", data: user });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createUserSchema.parse(req.body);
      const newUser = await userService.createUser(validated);
      res.status(201).json({ status: "success", data: newUser });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validated = updateUserSchema.parse(req.body);
      const updatedUser = await userService.updateUser(id, validated);
      res.status(200).json({ status: "success", data: updatedUser });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
