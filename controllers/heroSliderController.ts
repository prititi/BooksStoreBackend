import { Request, Response } from "express";
import Slider, { ISlider } from "../models/SliderModel";
import logger from "../logger";

export const addSliderImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const imageUrl = req.file?.path;
    if (!imageUrl) {
      res.status(400).json({ message: "Image is required" });
      return;
    }

    const sliderItem = new Slider({ imageUrl });
    await sliderItem.save();

    res.status(201).json({ message: "Image added to slider", sliderItem });
  } catch (err) {
    logger.error(`Error in addSliderImage: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const updateSliderSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { transitionSpeed, order } = req.body;

    const settings = await Slider.findOneAndUpdate(
      { settings: true },
      { transitionSpeed, order },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Slider settings updated", settings });
  } catch (err) {
    logger.error(`Error in updateSliderSettings: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};
