import { Request, Response } from "express";
import Order from "../models/OrderModel";
import UserActivity from "../models/UserActivityModel";
import Content from "../models/ContentModel";
import logger from "../logger";

export const generateSalesReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("Generating sales report...");
    const salesReport = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
          ordersCount: { $sum: 1 },
        },
      },
    ]);
    logger.info("Sales report generated successfully");
    res.status(200).json({
      reportType: "Sales Report",
      data: salesReport,
    });
  } catch (err) {
    logger.error(`Error generating sales report: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getUserActivityReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("Fetching user activity report...");
    const userActivityReport = await UserActivity.find().sort({ date: -1 });
    logger.info("User activity report fetched successfully");
    res.status(200).json({
      reportType: "User Activity Report",
      data: userActivityReport,
    });
  } catch (err) {
    logger.error(
      `Error fetching user activity report: ${(err as Error).message}`
    );
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getContentPerformanceReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("Generating content performance report...");
    const contentPerformanceReport = await Content.aggregate([
      {
        $project: {
          title: 1,
          views: 1,
          likes: 1,
          shares: 1,
          engagementScore: {
            $add: ["$views", "$likes", "$shares"],
          },
        },
      },
      { $sort: { engagementScore: -1 } },
    ]);
    logger.info("Content performance report generated successfully");
    res.status(200).json({
      reportType: "Content Performance Report",
      data: contentPerformanceReport,
    });
  } catch (err) {
    logger.error(
      `Error generating content performance report: ${(err as Error).message}`
    );
    res.status(500).json({ message: (err as Error).message });
  }
};
