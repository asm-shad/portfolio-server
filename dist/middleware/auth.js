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
exports.requireAdmin = exports.verifyToken = exports.authenticateToken = void 0;
const client_1 = require("@prisma/client");
const jwt_1 = require("../utils.ts/jwt");
const prisma = new client_1.PrismaClient();
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.accessToken ||
            (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        console.log("🔐 Extracted Token:", token ? `${token.substring(0, 20)}...` : "NO TOKEN");
        if (!token) {
            console.log("❌ No token found - returning 401");
            return res.status(401).json({
                success: false,
                message: "Access token required",
            });
        }
        console.log("✅ Token found, verifying...");
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        console.log("🔓 Token decoded:", decoded);
        const user = yield prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, role: true, status: true },
        });
        console.log("👤 User found in DB:", user);
        if (!user || user.status !== "ACTIVE") {
            console.log("❌ User not found or inactive");
            return res.status(401).json({
                success: false,
                message: "User not found or inactive",
            });
        }
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        console.log("✅ User authenticated:", req.user);
        console.log("➡️ Calling next() middleware");
        next();
    }
    catch (error) {
        console.log("❌ Token verification failed:", error);
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
});
exports.authenticateToken = authenticateToken;
exports.verifyToken = exports.authenticateToken;
const requireAdmin = (req, res, next) => {
    var _a, _b;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "SUPER_ADMIN" && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }
    next();
};
exports.requireAdmin = requireAdmin;
