import compression from "compression";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser"; // ✅ Add this

import { userRouter } from "./modules/user/user.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { postRouter } from "./modules/post/post.routes";
import { projectRouter } from "./modules/project/project.routes";
import { StatsRoutes } from "./modules/stats/stats.route";

const app = express();

// 🧠 Middleware
app.use(cookieParser()); // ✅ Add before routes
app.use(express.json());
app.use(compression());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ your frontend (if using React)
    credentials: true, // ✅ allows cookies
  })
);

// 🧩 Routes
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/project", projectRouter);
app.use("/api/stats", StatsRoutes);

// Default route
app.get("/", (_req, res) => {
  res.send("API is running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
