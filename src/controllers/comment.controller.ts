import type { Request, Response, NextFunction } from "express";
import { commentService } from "../services/comment.service.js";
import { createCommentSchema } from "../schemas/comment.schema.js";
import { idParamSchema } from "../schemas/common.schema.js";

class CommentController {
  async listByReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const comments = await commentService.getCommentsByReport(id);
      res.status(200).json({ status: "success", data: comments });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const validated = createCommentSchema.parse(req.body);

      const userId = req.user?.id_user;
      const userRole = req.user?.role;
      if (!userId || !userRole) {
        return res
          .status(401)
          .json({
            status: "error",
            message: "No autorizado: Falta información del usuario en el token",
          });
      }

      const newComment = await commentService.addComment(id, validated, userId, userRole);
      res.status(201).json({ status: "success", data: newComment });
    } catch (error: any) {
      if (error.message === "FORBIDDEN") {
        return res.status(403).json({
          status: "error",
          message: "No tienes permiso para comentar en esta denuncia",
        });
      }
      next(error);
    }
  }
}

export const commentController = new CommentController();
