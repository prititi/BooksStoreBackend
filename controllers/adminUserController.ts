import { Request, Response } from "express";
import UserModel, { IUser } from "../models/UserModel";
import logger from "../logger";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users: IUser[] = await UserModel.find();
    res.json(users);
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user: IUser | null = await UserModel.findById(req.params.user_id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { role } = req.body;
    const user = await UserModel.findById(req.params.user_id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.user_id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    logger.error((err as Error).message);
    res.status(500).json({ message: (err as Error).message });
  }
};
