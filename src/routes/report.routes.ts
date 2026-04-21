import { Router } from "express";
import { reportController } from "../controllers/report.controller.js";
import { commentController } from "../controllers/comment.controller.js";

const router = Router();

router.get("/reports", reportController.getAll);
router.get("/reports/:id", reportController.getOne);
router.post("/reports", reportController.create);

router.get("/reports/:id/comments", commentController.listByReport);
router.post("/reports/:id/comments", commentController.create);

export default router;
