import { Request, Response } from "express";
import ProfileModel, { IProfile } from "../models/ProfileModel";
import multer from "multer";
import path from "path";
import logger from "../logger";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const filename = `${Date.now()}${fileExtension}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

export const createOrUpdateProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  const {
    name,
    email,
    bio,
    avatarUrl,
    bannerUrl,
  }: {
    name: string;
    email: string;
    bio: string;
    avatarUrl?: string;
    bannerUrl?: string;
  } = req.body;

  try {
    let profile: IProfile | null = await ProfileModel.findOne({ userId });

    if (!profile) {
      profile = new ProfileModel({
        userId,
        name,
        email,
        bio,
        avatarUrl,
        bannerUrl,
      });
    } else {
      profile.name = name;
      profile.email = email;
      profile.bio = bio;
      profile.avatarUrl = avatarUrl ?? profile.avatarUrl;
      profile.bannerUrl = bannerUrl ?? profile.bannerUrl;
    }

    await profile.save();

    return res.status(200).json(profile);
  } catch (error) {
    logger.error(`Error in createOrUpdateProfile: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;

  try {
    const profile: IProfile | null = await ProfileModel.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    logger.error(`Error in getProfile: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadProfilePhoto = (req: Request, res: Response): void => {
  const userId = req.params.userId;
  upload.single("avatar")(req, res, async (err: any) => {
    if (err) {
      logger.error(`Error uploading avatar for user ${userId}: ${err.message}`);
      return res.status(400).json({ message: "Error uploading file" });
    }

    const avatarUrl = `/uploads/${req.file?.filename}`;

    try {
      let profile: IProfile | null = await ProfileModel.findOne({ userId });

      if (profile) {
        profile.avatarUrl = avatarUrl;
        await profile.save();
        return res.status(200).json({ avatarUrl });
      }

      return res.status(404).json({ message: "Profile not found" });
    } catch (error) {
      logger.error(`Error in uploadProfilePhoto for user ${userId}: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

export const uploadBannerPhoto = (req: Request, res: Response): void => {
  const userId = req.params.userId;
  upload.single("banner")(req, res, async (err: any) => {
    if (err) {
      logger.error(`Error uploading banner for user ${userId}: ${err.message}`);
      return res.status(400).json({ message: "Error uploading file" });
    }

    const bannerUrl = `/uploads/${req.file?.filename}`;

    try {
      let profile: IProfile | null = await ProfileModel.findOne({ userId });

      if (profile) {
        profile.bannerUrl = bannerUrl;
        await profile.save();
        return res.status(200).json({ bannerUrl });
      }

      return res.status(404).json({ message: "Profile not found" });
    } catch (error) {
      logger.error(`Error in uploadBannerPhoto for user ${userId}: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

export const deleteProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;

  try {
    const profile: IProfile | null = await ProfileModel.findOneAndDelete({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    logger.error(`Error in deleteProfile for user ${userId}: ${error}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
