// src/modules/post/post.controller.ts
import { Response } from "express";
import { PostService } from "./post.service";
import { AuthRequest } from "../../middleware/auth"; // Import AuthRequest

const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const payload = req.body;

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Use the authenticated user's ID
    payload.authorId = req.user.id;

    const result = await PostService.createPost(payload);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getAllFromDB = async (req: AuthRequest, res: Response) => {
  try {
    const q = req.query;
    const result = await PostService.getAllFromDB({
      page: Number(q.page) || 1,
      limit: Number(q.limit) || 10,
      tag: q.tag as string,
      authorId: q.authorId ? Number(q.authorId) : undefined,
      publishedOnly: q.published === "true" ? true : undefined,
      search: q.search as string,
    });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    const result = await PostService.getPostById(Number(req.params.id));
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const getPostBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const result = await PostService.getPostBySlug(req.params.slug);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await PostService.updatePost(
      Number(req.params.id),
      req.body,
      req.user
    );
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await PostService.deletePost(
      Number(req.params.id),
      req.user
    );
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const publishPost = async (req: AuthRequest, res: Response) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await PostService.publishPost(
      Number(req.params.id),
      req.user
    );
    res.status(200).json({
      success: true,
      message: "Post published successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const unpublishPost = async (req: AuthRequest, res: Response) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await PostService.unpublishPost(
      Number(req.params.id),
      req.user
    );
    res.status(200).json({
      success: true,
      message: "Post unpublished successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

const incrementViews = async (req: AuthRequest, res: Response) => {
  try {
    const result = await PostService.incrementViews(Number(req.params.id));
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const PostController = {
  createPost,
  getAllFromDB,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  incrementViews,
};
