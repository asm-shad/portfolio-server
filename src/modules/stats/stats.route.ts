import express from "express";
import { StatsController } from "./stats.controller";
import { authenticateToken, requireAdmin } from "../../middleware/auth";

const router = express.Router();

// protect if you prefer:
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  StatsController.getDashboardStats
);
// or public read:
// router.get("/", StatsController.getDashboardStats);

export const StatsRoutes = router;
