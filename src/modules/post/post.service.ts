// src/modules/post/post.service.ts
import { prisma } from "../../config/db";
import { Prisma, Post } from "@prisma/client";
import { generateSlug } from "../../utils.ts/slugify";

type GetPostsOpts = {
  page?: number;
  limit?: number;
  tag?: string;
  authorId?: number;
  publishedOnly?: boolean;
  search?: string;
};

const createPost = async (payload: any): Promise<Post> => {
  // require author
  if (!payload.authorId) throw new Error("authorId is required");
  const author = await prisma.user.findUnique({
    where: { id: Number(payload.authorId) },
  });
  if (!author) throw new Error("Author not found");

  // slug generation/uniqueness
  let slug = payload.slug ?? generateSlug(payload.title ?? "post");
  let exists = await prisma.post.findUnique({ where: { slug } });
  let c = 1;
  while (exists) {
    slug = `${slug}-${c++}`;
    exists = await prisma.post.findUnique({ where: { slug } });
  }
  payload.slug = slug;

  // publishedAt
  if (payload.isPublished && !payload.publishedAt)
    payload.publishedAt = new Date();

  const created = await prisma.post.create({
    data: {
      title: payload.title,
      content: payload.content,
      excerpt: payload.excerpt,
      slug: payload.slug,
      thumbnail: payload.thumbnail,
      isFeatured: !!payload.isFeatured,
      isPublished: !!payload.isPublished,
      tags: payload.tags ?? [],
      views: payload.views ?? 0,
      publishedAt: payload.publishedAt ?? null,
      author: { connect: { id: Number(payload.authorId) } },
    } as Prisma.PostCreateInput,
  });

  return created;
};

const getAllFromDB = async (opts: GetPostsOpts = {}) => {
  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
  const where: any = {};

  if (opts.tag) where.tags = { has: opts.tag };
  if (opts.authorId) where.authorId = Number(opts.authorId);
  if (opts.publishedOnly) where.isPublished = true;
  if (opts.search) {
    where.OR = [
      { title: { contains: opts.search, mode: "insensitive" } },
      { content: { contains: opts.search, mode: "insensitive" } },
      { excerpt: { contains: opts.search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await prisma.$transaction([
    prisma.post.findMany({
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
    prisma.post.count({ where }),
  ]);

  return { data, total, page, limit };
};

const getPostById = async (id: number) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, picture: true, title: true } },
    },
  });
  if (!post) throw new Error("Post not found");
  return post;
};

const getPostBySlug = async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, picture: true, title: true } },
    },
  });
  if (!post) throw new Error("Post not found");
  return post;
};

const updatePost = async (
  id: number,
  payload: Partial<Post> | any,
  user?: any
) => {
  // optional: ownership check - only author or admin can update
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new Error("Post not found");

  if (
    user &&
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN" &&
    existing.authorId !== Number(user.id)
  ) {
    throw new Error("Not allowed");
  }

  // if slug is changing ensure uniqueness
  if (payload.slug && payload.slug !== existing.slug) {
    const sExists = await prisma.post.findUnique({
      where: { slug: payload.slug },
    });
    if (sExists) throw new Error("Slug already exists");
  }

  // handle publishedAt
  if (payload.isPublished && !existing.publishedAt)
    payload.publishedAt = new Date();
  if (!payload.isPublished) payload.publishedAt = null;

  const updated = await prisma.post.update({
    where: { id },
    data: payload,
  });

  return updated;
};

const deletePost = async (id: number, user?: any) => {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new Error("Post not found");

  if (
    user &&
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN" &&
    existing.authorId !== Number(user.id)
  ) {
    throw new Error("Not allowed");
  }

  const deleted = await prisma.post.delete({ where: { id } });
  return deleted;
};

const publishPost = async (id: number, user?: any) => {
  // permission check
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new Error("Post not found");

  if (
    user &&
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN" &&
    existing.authorId !== Number(user.id)
  ) {
    throw new Error("Not allowed");
  }

  const updated = await prisma.post.update({
    where: { id },
    data: { isPublished: true, publishedAt: new Date() },
  });

  return updated;
};

const unpublishPost = async (id: number, user?: any) => {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new Error("Post not found");

  if (
    user &&
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN" &&
    existing.authorId !== Number(user.id)
  ) {
    throw new Error("Not allowed");
  }

  const updated = await prisma.post.update({
    where: { id },
    data: { isPublished: false, publishedAt: null },
  });

  return updated;
};

const incrementViews = async (id: number) => {
  const post = await prisma.post.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
  return post;
};

export const PostService = {
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
