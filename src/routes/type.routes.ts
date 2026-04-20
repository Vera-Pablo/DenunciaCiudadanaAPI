import { Router } from "express";
import { typeController } from "../controllers/type.controller.js";

const router = Router();

router.get("/types", typeController.getAll);
router.get("/types/:id", typeController.getOne);
router.post("/types", typeController.create);
router.put("/types/:id", typeController.update);
router.delete("/types/:id", typeController.delete);

export default router;
