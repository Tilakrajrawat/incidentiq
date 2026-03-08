import express from "express";
import cors from "cors";
import morgan from "morgan";
import { initAppInsights, logger } from "./utils/logger.js";
import authRoutes from "./routes/authRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { globalRateLimiter } from "./middleware/rateLimiter.js";

initAppInsights();

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(requestLogger);
app.use(globalRateLimiter);

app.get("/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
});

app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/incidents", recordRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(errorHandler);

export default app;
