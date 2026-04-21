import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { loginSchema } from "../schemas/auth.schema.js";

class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await authService.login(validated);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid credentials") {
        return res.status(401).json({ status: "error", message: error.message });
      }
      next(error);
    }
  }
}

export const authController = new AuthController();
