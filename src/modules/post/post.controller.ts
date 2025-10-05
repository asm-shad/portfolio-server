// src/modules/post/post.controller.ts
import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    // if auth attached user id, prefer that as authorId
    if ((req as any).user?.id) payload.authorId = Number((req as any).user.id);
    const result = await PostService.createPost(payload);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const getAllFromDB = async (req: Request, res: Response) => {
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
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const result = await PostService.getPostById(Number(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const result = await PostService.getPostBySlug(req.params.slug);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const result = await PostService.updatePost(
      Number(req.params.id),
      req.body,
      (req as any).user
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const result = await PostService.deletePost(
      Number(req.params.id),
      (req as any).user
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const publishPost = async (req: Request, res: Response) => {
  try {
    const result = await PostService.publishPost(
      Number(req.params.id),
      (req as any).user
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const unpublishPost = async (req: Request, res: Response) => {
  try {
    const result = await PostService.unpublishPost(
      Number(req.params.id),
      (req as any).user
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const incrementViews = async (req: Request, res: Response) => {
  try {
    const result = await PostService.incrementViews(Number(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
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
