import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyAccessToken } from "../utils.ts/jwt";

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies.accessToken ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    console.log(
      "🔐 Extracted Token:",
      token ? `${token.substring(0, 20)}...` : "NO TOKEN"
    );

    if (!token) {
      console.log("❌ No token found - returning 401");
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    console.log("✅ Token found, verifying...");
    const decoded = verifyAccessToken(token) as any;
    console.log("🔓 Token decoded:", decoded);

    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.log("❌ Token verification failed:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const verifyToken = authenticateToken;

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "SUPER_ADMIN" && req.user?.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};
