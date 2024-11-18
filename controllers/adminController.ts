import { Request, Response } from "express";
import Post, { IPost } from "../models/PostModel";
import logger from "../logger";

export const getAllPosts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("Fetching all posts");
    const posts: IPost[] = await Post.find();
    logger.info(`Found ${posts.length} posts`);
    res.json(posts);
  } catch (err) {
    logger.error(`Error fetching posts: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const approvePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postId = req.params.post_id;
    logger.info(`Approving post with ID: ${postId}`);
    const post = await Post.findById(postId);

    if (!post) {
      logger.warn(`Post with ID: ${postId} not found`);
      res.status(404).json({ message: "Post not found" });
      return;
    }

    post.approved = true;
    await post.save();
    logger.info(`Post with ID: ${postId} approved successfully`);
    res.status(200).json({ message: "Post approved successfully", post });
  } catch (err) {
    logger.error(`Error approving post: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};

export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const postId = req.params.post_id;
    logger.info(`Attempting to delete post with ID: ${postId}`);
    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      logger.warn(`Post with ID: ${postId} not found for deletion`);
      res.status(404).json({ message: "Post not found" });
      return;
    }

    logger.info(`Post with ID: ${postId} deleted successfully`);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    logger.error(`Error deleting post: ${(err as Error).message}`);
    res.status(500).json({ message: (err as Error).message });
  }
};
