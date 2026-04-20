import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

const router = Router();

router.get("/users", userController.list);
router.get("/users/:id", userController.getProfile);
router.post("/users", userController.create);
router.patch("/users/:id", userController.update);

export default router;
