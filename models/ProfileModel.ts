import mongoose, { Document, Schema } from "mongoose";

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  name: string;
  email: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedIn?: string;
  };
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    avatarUrl: {
      type: String,
    },
    bannerUrl: {
      type: String,
    },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      linkedIn: { type: String },
    },
    dateOfBirth: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ProfileModel = mongoose.model<IProfile>("Profile", profileSchema);
export default ProfileModel;
