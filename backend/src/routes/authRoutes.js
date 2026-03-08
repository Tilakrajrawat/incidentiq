import { Router } from "express";
import { register, login, getCurrentUser, listResponders } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { validateRegister } from "../middleware/validate.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/responders", authMiddleware, requireRole("responder", "admin"), listResponders);

export default router;
