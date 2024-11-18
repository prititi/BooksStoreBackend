import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  title: string;
  views: number;
  likes: number;
  shares: number;
}

const ContentSchema: Schema = new Schema({
  title: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 }
});

export default mongoose.model<IContent>("Content", ContentSchema);
