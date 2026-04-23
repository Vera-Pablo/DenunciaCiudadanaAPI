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
      if (!userId) {
        return res
          .status(401)
          .json({
            status: "error",
            message: "No autorizado: Falta información del usuario en el token",
          });
      }

      const newComment = await commentService.addComment(id, {
        ...validated,
        id_user: userId,
      });
      res.status(201).json({ status: "success", data: newComment });
    } catch (error) {
      next(error);
    }
  }
}

export const commentController = new CommentController();
