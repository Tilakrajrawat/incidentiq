import { Router } from "express";
import { register, login, getCurrentUser } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRegister } from "../middleware/validate.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);

export default router;
