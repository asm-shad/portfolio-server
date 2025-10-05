import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthRequest } from "../../middleware/auth";
import { setAuthCookies } from "../../utils.ts/setAuthCookies";

const loginWithEmailAndPassword = async (req: Request, res: Response) => {
  try {
    const { user, tokens } = await AuthService.loginWithEmailAndPassword(
      req.body
    );

    // Set cookies
    setAuthCookies(res, tokens);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      tokens,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const authWithGoogle = async (req: Request, res: Response) => {
  try {
    const { user, tokens } = await AuthService.authWithGoogle(req.body);

    // Set cookies
    setAuthCookies(res, tokens);

    res.status(200).json({
      success: true,
      message: "Google authentication successful",
      user,
      tokens,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const { user, tokens } = await AuthService.refreshToken(refreshToken);

    // Set new cookies
    setAuthCookies(res, tokens);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      user,
      tokens,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    // Clear cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    // Add null check for req.user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await AuthService.getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const AuthController = {
  loginWithEmailAndPassword,
  authWithGoogle,
  refreshToken,
  logout,
  getCurrentUser,
};
