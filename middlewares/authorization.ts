import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../logger";

interface CustomRequest extends Request {
  user?: { role: string } | JwtPayload | string;
}

const getRoleFromUser = (
  user: { role: string } | JwtPayload | string
): string | undefined => {
  if (typeof user === "string") {
    const decoded = jwt.verify(
      user,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayload;
    return decoded?.role;
  } else if (typeof user === "object" && "role" in user) {
    return user.role;
  }
  return undefined;
};

export const roleBasedAccess =
  (requiredRole: string) =>
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { user } = req;

      if (!user) {
        logger.error("Unauthorized access - User not found");
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }
      const role = getRoleFromUser(user);

      if (role === requiredRole) {
        return next();
      } else {
        logger.error("Forbidden access - Insufficient role");
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient role permissions" });
      }
    } catch (error) {
      logger.error(`Error during role-based access check: ${error}`);
      return res
        .status(500)
        .json({ message: "Internal Server Error: Please try again later" });
    }
  };
