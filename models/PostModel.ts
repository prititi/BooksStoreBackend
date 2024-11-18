import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  description: string;
  photoUrl?: string;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  approved?: Boolean;
}

const postSchema: Schema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    content: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);
export default Post;
