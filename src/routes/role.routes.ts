import { Router } from "express";
import { roleController } from "../controllers/role.controller.js";

const router = Router();

router.get("/roles", roleController.getAll);
router.get("/roles/:id", roleController.getOne);
router.post("/roles", roleController.create);
router.put("/roles/:id", roleController.update);
router.delete("/roles/:id", roleController.delete);

export default router;
