import { Request, Response } from "express";
import Post from "../models/PostModel";
import Follow from "../models/FollowModel";
import logger from "../logger";

export const createPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  const {
    title,
    description,
    photoUrl,
  }: { title: string; description: string; photoUrl?: string } = req.body;

  try {
    const newPost = new Post({
      userId,
      title,
      description,
      photoUrl,
      likes: [],
    });

    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    logger.error(`Error in createPost: ${(error as Error).message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPosts = async (
  _: Request,
  res: Response
): Promise<Response> => {
  try {
    const posts = await Post.find().populate("userId", "name email");
    return res.status(200).json(posts);
  } catch (error) {
    logger.error(`Error in getPosts: ${(error as Error).message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPostById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate("userId", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    logger.error(`Error in getPostById: ${(error as Error).message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const likePost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      return res.status(400).json({ message: "User already liked this post" });
    }

    post.likes.push(userId);
    await post.save();

    return res.status(200).json({ message: "Post liked successfully", post });
  } catch (error) {
    logger.error(`Error in likePost: ${(error as Error).message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLikesByPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate("likes", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post.likes);
  } catch (error) {
    logger.error(`Error in getLikesByPost: ${(error as Error).message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const followUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  const { followUserId }: { followUserId: string } = req.body;

  try {
    const existingFollow = await Follow.findOne({
      followerId: userId,
      followingId: followUserId,
    });

    if (existingFollow) {
      return res.status(400).json({ message: "Already following this user" });
    }

    const follow = new Follow({
      followerId: userId,
      followingId: followUserId,
    });

    await follow.save();
    return res
      .status(200)
      .json({ message: "User followed successfully", follow });
  } catch (error) {
    logger.error(`Error in followUser: ${(error as Error).message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFollowers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;

  try {
    const followers = await Follow.find({ followingId: userId }).populate(
      "followerId",
      "name email"
    );

    if (!followers.length) {
      return res.status(404).json({ message: "No followers found" });
    }

    return res.status(200).json(followers);
  } catch (error) {
    logger.error(`Error in getFollowers: ${(error as Error).message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
