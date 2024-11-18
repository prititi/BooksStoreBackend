import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  likePost,
  getLikesByPost,
  followUser,
  getFollowers,
} from "../controllers/postController";

const router: Router = Router();

router.post("/posts", createPost);

router.get("/posts", getPosts);

router.get("/posts/:postId", getPostById);

router.post("/posts/:postId/like", likePost);

router.get("/posts/:postId/likes", getLikesByPost);

router.post("/users/:userId/follow", followUser);

router.get("/users/:userId/followers", getFollowers);

export default router;
