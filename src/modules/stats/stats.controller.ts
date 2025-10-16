import { Request, Response } from "express";
import { StatsService } from "./stats.service";

export const StatsController = {
  async getDashboardStats(_req: Request, res: Response) {
    try {
      const data = await StatsService.getDashboardStats();
      res.status(200).json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  },
};
