// app.ts
import compression from "compression";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import { userRouter } from "./modules/user/user.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { postRouter } from "./modules/post/post.routes";
import { projectRouter } from "./modules/project/project.routes";
import { StatsRoutes } from "./modules/stats/stats.route";

const app = express();

// ===== CORS SETUP =====
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://asmshadportfolio.vercel.app",
  // add any other custom domains here
];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser/SSR/health checks (no Origin header)
      if (!origin) return cb(null, true);

      const isExactAllowed = ALLOWED_ORIGINS.includes(origin);
      const isVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(origin); // preview deployments

      if (isExactAllowed || isVercelPreview) return cb(null, true);
      return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true, // set to true only if you actually use cookies
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ===== COMMON MIDDLEWARE =====
app.use(cookieParser());
app.use(express.json());
app.use(compression());

// ===== ROUTES =====
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/project", projectRouter);
app.use("/api/stats", StatsRoutes);

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
