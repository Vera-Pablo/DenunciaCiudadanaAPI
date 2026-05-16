import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from "../schemas/auth.schema.js";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const newUser = await authService.register(validated);
      res.status(201).json({
        status: "success",
        data: newUser,
      });
    } catch (error) {
      if (error instanceof Error && (error.message.includes("already exists"))) {
        return res.status(409).json({ status: "error", message: error.message });
      }
      next(error);
    }
  }

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

  async forgotPassword(req: Request, res: Response, next: NextFunction){
    try{
      const validated = forgotPasswordSchema.parse(req.body); 
      await authService.requestPasswordReset(validated); 

      res.status(200).json({
        status: "success",
        message: "Si el correo existe en nuestro sistema, se ha enviado un enlace de recuperación.",
      })
    } catch (error){
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = resetPasswordSchema.parse(req.body);
      await authService.resetPassword(validated);

      res.status(200).json({
        status: "success",
        message: "Contraseña actualizada correctamente.",
      });
    } catch (error) {
      if (error instanceof Error && (error.message.includes("expirado") || error.message.includes("inválido"))){
        return res.status(401).json({status: "error", message: error.message});
      }     
      next(error);
    }
  }
}

export const authController = new AuthController();
