import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  totalAmount: number;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>("Order", OrderSchema);
