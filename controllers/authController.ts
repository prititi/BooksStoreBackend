import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/authMiddleware";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/emailService";
import logger from "../logger";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    name,
    phoneNumber,
    email,
    password,
  }: { name: string; phoneNumber: string; email: string; password: string } =
    req.body;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
    });
    await user.save();

    const verificationToken = jwt.sign(
      { email: user.email },
      process.env.EMAIL_VERIFICATION_SECRET as string,
      { expiresIn: "1h" }
    );

    user.emailVerificationToken = verificationToken;
    await user.save();

    await sendVerificationEmail(user.email, verificationToken);

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      user: { email: user.email, phoneNumber: user.phoneNumber },
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error during registration" });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    if (!user.isEmailVerified) {
      return res
        .status(400)
        .json({ error: "Email not verified. Please check your email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const accessToken = generateAccessToken(user.id.toString(), user?.role);
    const refreshToken = generateRefreshToken(user.id.toString(), user?.role);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000, // 1 hour
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000, // 1 day
    });

    return res.status(200).json({
      message: "User logged in successfully",
      user: { email: user.email, phoneNumber: user.phoneNumber },
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error during login" });
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { userId: string; role: string };
    const accessToken = generateAccessToken(decoded.userId, decoded?.role);

    return res.status(200).json({
      accessToken,
    });
  } catch (error) {
    logger.error(error);
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Verification token is required" });
  }

  try {
    const user = await UserModel.findOne({ emailVerificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error during email verification" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email }: { email: string } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "No user found with this email." });
    }

    const resetToken = jwt.sign(
      { email: user.email },
      process.env.PASSWORD_RESET_SECRET as string,
      { expiresIn: "1h" }
    );

    user.passwordResetToken = resetToken;
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken);

    return res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error during forgot-password" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { token, newPassword }: { token: string; newPassword: string } =
    req.body;

  try {
    const decoded = jwt.verify(
      token,
      process.env.PASSWORD_RESET_SECRET as string
    ) as { email: string };

    const user = await UserModel.findOne({ email: decoded.email });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token." });
    }

    if (user.passwordResetToken !== token) {
      return res.status(400).json({ error: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.passwordResetToken = "";
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    logger.error(error);
    return res
      .status(500)
      .json({ error: "Internal server error during reset-password" });
  }
};

export const logout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({ message: "Logged out successfully" });
};
