import express from "express";
import { StatsController } from "./stats.controller";

const router = express.Router();

router.get("/", StatsController.getDashboardStats);

export const StatsRoutes = router;
