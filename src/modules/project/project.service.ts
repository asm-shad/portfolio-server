// src/modules/project/project.service.ts
import { Project, ProjectStatus } from "@prisma/client";
import { prisma } from "../../config/db";

type GetProjectsOpts = {
  page?: number;
  limit?: number;
  technology?: string;
  status?: ProjectStatus | string;
  search?: string;
};

const createProject = async (payload: any): Promise<Project> => {
  if (!payload.authorId) throw new Error("authorId is required");

  const author = await prisma.user.findUnique({
    where: { id: Number(payload.authorId) },
  });
  if (!author) throw new Error("Author not found");

  const created = await prisma.project.create({
    data: {
      title: payload.title,
      description: payload.description,
      content: payload.content ?? null,
      thumbnail: payload.thumbnail ?? null,
      images: payload.images ?? [],
      technologies: payload.technologies ?? [],
      githubUrl: payload.githubUrl ?? null,
      liveUrl: payload.liveUrl ?? null,
      featured: !!payload.featured,
      status: payload.status ?? ProjectStatus.COMPLETED,
      startDate: payload.startDate ? new Date(payload.startDate) : null,
      endDate: payload.endDate ? new Date(payload.endDate) : null,
      author: { connect: { id: Number(payload.authorId) } },
    },
  });

  return created;
};

const getAllFromDB = async (opts: GetProjectsOpts = {}) => {
  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;

  const where: any = {};

  if (opts.technology) where.technologies = { has: opts.technology };
  if (opts.status) where.status = opts.status;
  if (opts.search) {
    where.OR = [
      { title: { contains: opts.search, mode: "insensitive" } },
      { description: { contains: opts.search, mode: "insensitive" } },
      { content: { contains: opts.search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await prisma.$transaction([
    prisma.project.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, picture: true, title: true },
        },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return { data, total, page, limit };
};

const getProjectById = async (id: number) => {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, picture: true, title: true } },
    },
  });
  if (!project) throw new Error("Project not found");
  return project;
};

const updateProject = async (
  id: number,
  payload: Partial<Project> | any,
  user?: any
) => {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new Error("Project not found");

  if (
    user &&
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN" &&
    existing.authorId !== Number(user.id)
  ) {
    throw new Error("Not allowed");
  }

  if (payload.startDate) payload.startDate = new Date(payload.startDate);
  if (payload.endDate) payload.endDate = new Date(payload.endDate);

  const updated = await prisma.project.update({
    where: { id },
    data: payload,
  });

  return updated;
};

const deleteProject = async (id: number, user?: any) => {
  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) throw new Error("Project not found");

  if (
    user &&
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN" &&
    existing.authorId !== Number(user.id)
  ) {
    throw new Error("Not allowed");
  }

  const deleted = await prisma.project.delete({ where: { id } });
  return deleted;
};

const getByAuthor = async (authorId: number) => {
  const projects = await prisma.project.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
  });
  return projects;
};

const getFeatured = async () => {
  const projects = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  });
  return projects;
};

export const ProjectService = {
  createProject,
  getAllFromDB,
  getProjectById,
  updateProject,
  deleteProject,
  getByAuthor,
  getFeatured,
};
