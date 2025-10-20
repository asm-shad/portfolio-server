// src/modules/post/post.routes.ts
import express from "express";
import { PostController } from "./post.controller";
import { verifyToken } from "../../middleware/auth";

const router = express.Router();

router.get("/", PostController.getAllFromDB); // public + supports pagination/filter
router.get("/slug/:slug", PostController.getPostBySlug); // public
router.get("/:id", PostController.getPostById); // public

// protected routes (owner/admin)
router.post("/", verifyToken, PostController.createPost);
router.patch("/:id", verifyToken, PostController.updatePost);
router.patch("/:id/publish", verifyToken, PostController.publishPost);
router.patch("/:id/unpublish", verifyToken, PostController.unpublishPost);
router.patch("/:id/views", PostController.incrementViews);
router.delete("/:id", verifyToken, PostController.deletePost);

export const postRouter = router;
