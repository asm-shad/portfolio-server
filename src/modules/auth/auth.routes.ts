import express from "express";
import { AuthController } from "./auth.controller";
import { authenticateToken } from "../../middleware/auth";

const router = express.Router();

// Public routes
router.post("/login", AuthController.loginWithEmailAndPassword);
router.post("/google", AuthController.authWithGoogle);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

// Protected routes (authenticated users)
router.get("/me", authenticateToken, AuthController.getCurrentUser);

export const authRouter = router; // Changed from authRoutes to authRouter
