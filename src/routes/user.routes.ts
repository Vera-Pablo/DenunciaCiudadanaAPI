import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/users", userController.list);
router.get("/users/me", authenticateToken, userController.getMyProfile);
router.patch("/users/me", authenticateToken, userController.updateMyProfile);
router.get("/users/:id", userController.getProfile);
router.post("/users", userController.create);
router.patch("/users/:id", userController.update);

export default router;
