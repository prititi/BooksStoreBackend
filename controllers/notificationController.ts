import { Request, Response } from "express";
import Notification from "../models/NotificationModel";
import Alert from "../models/AlertModel";
import logger from "../logger";

export const getNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.status(200).json({
      notifications,
    });
  } catch (err) {
    logger.error(`Error in getNotifications: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const setAutomatedAlerts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { contentId, reason, alertType } = req.body;

  try {
    const newAlert = new Alert({
      contentId,
      reason,
      alertType,
      createdAt: new Date(),
    });

    await newAlert.save();

    res.status(201).json({
      message: "Alert created successfully",
      alert: newAlert,
    });
  } catch (err) {
    logger.error(`Error in setAutomatedAlerts: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};
