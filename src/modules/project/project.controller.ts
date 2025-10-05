// src/modules/project/project.controller.ts
import { Request, Response } from "express";
import { ProjectService } from "./project.service";

const createProject = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    if ((req as any).user?.id) payload.authorId = Number((req as any).user.id);
    const result = await ProjectService.createProject(payload);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const q = req.query;
    const result = await ProjectService.getAllFromDB({
      page: Number(q.page) || 1,
      limit: Number(q.limit) || 10,
      technology: q.technology as string,
      status: (q.status as any) ?? undefined,
      search: q.search as string,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const getProjectById = async (req: Request, res: Response) => {
  try {
    const result = await ProjectService.getProjectById(Number(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const updateProject = async (req: Request, res: Response) => {
  try {
    const result = await ProjectService.updateProject(
      Number(req.params.id),
      req.body,
      (req as any).user
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const deleteProject = async (req: Request, res: Response) => {
  try {
    const result = await ProjectService.deleteProject(
      Number(req.params.id),
      (req as any).user
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const getByAuthor = async (req: Request, res: Response) => {
  try {
    const result = await ProjectService.getByAuthor(
      Number(req.params.authorId)
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

const getFeatured = async (req: Request, res: Response) => {
  try {
    const result = await ProjectService.getFeatured();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : error);
  }
};

export const ProjectController = {
  createProject,
  getAllFromDB,
  getProjectById,
  updateProject,
  deleteProject,
  getByAuthor,
  getFeatured,
};
