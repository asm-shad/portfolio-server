"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
// src/modules/post/post.service.ts
const db_1 = require("../../config/db");
const slugify_1 = require("../../utils.ts/slugify");
const createPost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    // require author
    if (!payload.authorId)
        throw new Error("authorId is required");
    const author = yield db_1.prisma.user.findUnique({
        where: { id: Number(payload.authorId) },
    });
    if (!author)
        throw new Error("Author not found");
    // slug generation/uniqueness
    let slug = (_a = payload.slug) !== null && _a !== void 0 ? _a : (0, slugify_1.generateSlug)((_b = payload.title) !== null && _b !== void 0 ? _b : "post");
    let exists = yield db_1.prisma.post.findUnique({ where: { slug } });
    let c = 1;
    while (exists) {
        slug = `${slug}-${c++}`;
        exists = yield db_1.prisma.post.findUnique({ where: { slug } });
    }
    payload.slug = slug;
    // publishedAt
    if (payload.isPublished && !payload.publishedAt)
        payload.publishedAt = new Date();
    const created = yield db_1.prisma.post.create({
        data: {
            title: payload.title,
            content: payload.content,
            excerpt: payload.excerpt,
            slug: payload.slug,
            thumbnail: payload.thumbnail,
            isFeatured: !!payload.isFeatured,
            isPublished: !!payload.isPublished,
            tags: (_c = payload.tags) !== null && _c !== void 0 ? _c : [],
            views: (_d = payload.views) !== null && _d !== void 0 ? _d : 0,
            publishedAt: (_e = payload.publishedAt) !== null && _e !== void 0 ? _e : null,
            author: { connect: { id: Number(payload.authorId) } },
        },
    });
    return created;
});
const getAllFromDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (opts = {}) {
    const page = opts.page && opts.page > 0 ? opts.page : 1;
    const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
    const where = {};
    if (opts.tag)
        where.tags = { has: opts.tag };
    if (opts.authorId)
        where.authorId = Number(opts.authorId);
    if (opts.publishedOnly)
        where.isPublished = true;
    if (opts.search) {
        where.OR = [
            { title: { contains: opts.search, mode: "insensitive" } },
            { content: { contains: opts.search, mode: "insensitive" } },
            { excerpt: { contains: opts.search, mode: "insensitive" } },
        ];
    }
    const [data, total] = yield db_1.prisma.$transaction([
        db_1.prisma.post.findMany({
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
        db_1.prisma.post.count({ where }),
    ]);
    return { data, total, page, limit };
});
const getPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield db_1.prisma.post.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, name: true, picture: true, title: true } },
        },
    });
    if (!post)
        throw new Error("Post not found");
    return post;
});
const getPostBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield db_1.prisma.post.findUnique({
        where: { slug },
        include: {
            author: { select: { id: true, name: true, picture: true, title: true } },
        },
    });
    if (!post)
        throw new Error("Post not found");
    return post;
});
const updatePost = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // optional: ownership check - only author or admin can update
    const existing = yield db_1.prisma.post.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Post not found");
    if (user &&
        user.role !== "ADMIN" &&
        user.role !== "SUPER_ADMIN" &&
        existing.authorId !== Number(user.id)) {
        throw new Error("Not allowed");
    }
    // if slug is changing ensure uniqueness
    if (payload.slug && payload.slug !== existing.slug) {
        const sExists = yield db_1.prisma.post.findUnique({
            where: { slug: payload.slug },
        });
        if (sExists)
            throw new Error("Slug already exists");
    }
    // handle publishedAt
    if (payload.isPublished && !existing.publishedAt)
        payload.publishedAt = new Date();
    if (!payload.isPublished)
        payload.publishedAt = null;
    const updated = yield db_1.prisma.post.update({
        where: { id },
        data: payload,
    });
    return updated;
});
const deletePost = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield db_1.prisma.post.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Post not found");
    if (user &&
        user.role !== "ADMIN" &&
        user.role !== "SUPER_ADMIN" &&
        existing.authorId !== Number(user.id)) {
        throw new Error("Not allowed");
    }
    const deleted = yield db_1.prisma.post.delete({ where: { id } });
    return deleted;
});
const publishPost = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    // permission check
    const existing = yield db_1.prisma.post.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Post not found");
    if (user &&
        user.role !== "ADMIN" &&
        user.role !== "SUPER_ADMIN" &&
        existing.authorId !== Number(user.id)) {
        throw new Error("Not allowed");
    }
    const updated = yield db_1.prisma.post.update({
        where: { id },
        data: { isPublished: true, publishedAt: new Date() },
    });
    return updated;
});
const unpublishPost = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield db_1.prisma.post.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Post not found");
    if (user &&
        user.role !== "ADMIN" &&
        user.role !== "SUPER_ADMIN" &&
        existing.authorId !== Number(user.id)) {
        throw new Error("Not allowed");
    }
    const updated = yield db_1.prisma.post.update({
        where: { id },
        data: { isPublished: false, publishedAt: null },
    });
    return updated;
});
const incrementViews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield db_1.prisma.post.update({
        where: { id },
        data: { views: { increment: 1 } },
    });
    return post;
});
exports.PostService = {
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
