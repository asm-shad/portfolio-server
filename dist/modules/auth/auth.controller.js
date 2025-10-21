"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const setAuthCookies_1 = require("../../utils.ts/setAuthCookies");
const loginWithEmailAndPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, tokens } = yield auth_service_1.AuthService.loginWithEmailAndPassword(req.body);
        // Set cookies
        (0, setAuthCookies_1.setAuthCookies)(res, tokens);
        res.status(200).json({
            success: true,
            message: "Login successful",
            user,
            tokens,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
const authWithGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, tokens } = yield auth_service_1.AuthService.authWithGoogle(req.body);
        // Set cookies
        (0, setAuthCookies_1.setAuthCookies)(res, tokens);
        res.status(200).json({
            success: true,
            message: "Google authentication successful",
            user,
            tokens,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required",
            });
        }
        const { user, tokens } = yield auth_service_1.AuthService.refreshToken(refreshToken);
        // Set new cookies
        (0, setAuthCookies_1.setAuthCookies)(res, tokens);
        res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            user,
            tokens,
        });
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Add null check for req.user
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }
        const user = yield auth_service_1.AuthService.getCurrentUser(req.user.id);
        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            user,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
});
exports.AuthController = {
    loginWithEmailAndPassword,
    authWithGoogle,
    refreshToken,
    logout,
    getCurrentUser,
};
