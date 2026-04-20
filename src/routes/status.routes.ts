import { Router } from "express";
import { statusController } from "../controllers/status.controller.js";

const router = Router();

router.get("/statuses", statusController.getAll);
router.get("/statuses/:id", statusController.getOne);
router.post("/statuses", statusController.create);
router.put("/statuses/:id", statusController.update);
router.delete("/statuses/:id", statusController.delete);

export default router;
