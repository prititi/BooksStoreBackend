import { Request, Response } from "express";
import BookModel, { IBook } from "../models/BookModel";
import logger from "../logger";

export const postBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, description, language, price, category, img } =
      req.body;

    const book = new BookModel({
      title,
      author,
      description,
      language,
      price,
      category,
      img,
    });

    await book.save();
    res.status(201).json(book);
  } catch (err) {
    logger.error(`Error in postBook: ${(err as Error).message}`);
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getAllBooks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const meatHub: IBook[] = await BookModel.find();
    res.json(meatHub);
  } catch (err) {
    logger.error(`Error in getAllBooks: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const meatHub: IBook | null = await BookModel.findById(req.params.id);
    if (!meatHub) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json(meatHub);
  } catch (err) {
    logger.error(`Error in getBookById: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deleteBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedBook = await BookModel.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    logger.error(`Error in deleteBookById: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const updateBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, author, description, language, price, category, img } =
      req.body;
    const updatedBook = await BookModel.findByIdAndUpdate(
      req.params.id,
      { title, author, description, language, price, category, img },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json(updatedBook);
  } catch (err) {
    logger.error(`Error in updateBookById: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};
