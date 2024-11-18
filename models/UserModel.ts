import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  addresses: string[];
  isEmailVerified: boolean;
  emailVerificationToken: string;
  passwordResetToken: string;
  role: string
}

export enum Roles {
  ADMIN = "admin",
  USER = "user",
  AUTHOR = "author",
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  addresses: {
    type: [String],
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
    required: true,
  },
  emailVerificationToken: {
    type: String,
    required: false,
  },
  passwordResetToken: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(Roles),
    default: 'user'
  },
});

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
