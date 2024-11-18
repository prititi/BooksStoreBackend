import { Request, Response } from "express";
import CartModel, { ICartItem } from "../models/CartModel";
import logger from "../logger";

export const addItemToCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const {
    productId,
    quantity,
    price,
    userId,
  }: { productId: string; quantity: number; price: number; userId: string } =
    req.body;

  try {
    let cartItem = await CartModel.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = new CartModel({
        userId,
        productId,
        quantity,
        price,
      });
    }

    await cartItem.save();
    return res.status(200).json(cartItem);
  } catch (error) {
    logger.error(`Error in addItemToCart: ${(error as Error).message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeItemFromCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { itemId } = req.params;

  try {
    const cartItem = await CartModel.findByIdAndDelete(itemId);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({ message: "Cart item removed successfully" });
  } catch (error) {
    logger.error(`Error in removeItemFromCart: ${(error as Error).message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCart = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;

  try {
    const cartItems = await CartModel.find({ userId });

    if (!cartItems.length) {
      return res.status(404).json({ message: "No items in the cart" });
    }

    const totalCost = cartItems.reduce(
      (acc: number, item: ICartItem) => acc + item.quantity * item.price,
      0
    );
    const totalQuantity = cartItems.reduce(
      (acc: number, item: ICartItem) => acc + item.quantity,
      0
    );

    return res.status(200).json({ cartItems, totalCost, totalQuantity });
  } catch (error) {
    logger.error(`Error in getCart: ${(error as Error).message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
