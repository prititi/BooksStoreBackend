import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  type: string;
  message: string; 
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>("Notification", NotificationSchema);
