"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.post("/login", auth_controller_1.AuthController.loginWithEmailAndPassword);
router.post("/google", auth_controller_1.AuthController.authWithGoogle);
router.post("/refresh", auth_controller_1.AuthController.refreshToken);
router.post("/logout", auth_controller_1.AuthController.logout);
// Protected routes (authenticated users)
router.get("/me", auth_1.authenticateToken, auth_controller_1.AuthController.getCurrentUser);
exports.authRouter = router; // Changed from authRoutes to authRouter
