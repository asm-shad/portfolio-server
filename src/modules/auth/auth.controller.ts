import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { setAuthCookies } from "../../utils.ts/setAuthCookies";

const loginWithEmailAndPassword = async (req: Request, res: Response) => {
  try {
    const { user, tokens } = await AuthService.loginWithEmailAndPassword(
      req.body
    );

    // Set cookies here
    setAuthCookies(res, tokens);

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const authWithGoogle = async (req: Request, res: Response) => {
  try {
    const { user, tokens } = await AuthService.authWithGoogle(req.body);

    // Set cookies here
    setAuthCookies(res, tokens);

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const AuthController = {
  loginWithEmailAndPassword,
  authWithGoogle,
};
