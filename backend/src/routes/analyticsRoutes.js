import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { getSummary, getTrends, getResolutionTime } from "../controllers/analyticsController.js";

const router = Router();

router.use(authMiddleware, requireRole("admin"));

router.get("/summary", getSummary);
router.get("/trends", getTrends);
router.get("/resolution-time", getResolutionTime);

export default router;
