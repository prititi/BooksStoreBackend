import mongoose, { Schema, Document } from "mongoose";

export interface IUserActivity extends Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  date: Date;
}

const UserActivitySchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IUserActivity>("UserActivity", UserActivitySchema);
