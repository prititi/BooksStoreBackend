import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  contentId: mongoose.Types.ObjectId;
  reason: string;
  alertType: string;
  createdAt: Date;
}

const AlertSchema: Schema = new Schema({
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  reason: { type: String, required: true },
  alertType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IAlert>("Alert", AlertSchema);
