import { Request, Response } from "express";
import { UserService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.createUser(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getAllFromDB();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getUserById(Number(req.params.id));
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.updateUser(
      Number(req.params.id),
      req.body
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await UserService.deleteUser(Number(req.params.id));
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const UserController = {
  createUser,
  getAllFromDB,
  getUserById,
  updateUser,
  deleteUser,
};
