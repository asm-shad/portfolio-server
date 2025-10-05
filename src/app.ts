import compression from "compression";
import cors from "cors";
import express from "express";
import { userRouter } from "./modules/user/user.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { postRouter } from "./modules/post/post.routes";
import { projectRouter } from "./modules/project/project.routes";

const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests

app.use(
  cors({
    origin: "http://localhost:5000",
    credentials: true,
  })
);

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/project", projectRouter);

// Default route for testing
app.get("/", (_req, res) => {
  res.send("API is running");
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
