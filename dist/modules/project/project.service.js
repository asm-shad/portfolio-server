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
exports.ProjectService = void 0;
// src/modules/project/project.service.ts
const client_1 = require("@prisma/client");
const db_1 = require("../../config/db");
const createProject = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!payload.authorId)
        throw new Error("authorId is required");
    const author = yield db_1.prisma.user.findUnique({
        where: { id: Number(payload.authorId) },
    });
    if (!author)
        throw new Error("Author not found");
    const created = yield db_1.prisma.project.create({
        data: {
            title: payload.title,
            description: payload.description,
            content: (_a = payload.content) !== null && _a !== void 0 ? _a : null,
            thumbnail: (_b = payload.thumbnail) !== null && _b !== void 0 ? _b : null,
            images: (_c = payload.images) !== null && _c !== void 0 ? _c : [],
            technologies: (_d = payload.technologies) !== null && _d !== void 0 ? _d : [],
            githubUrl: (_e = payload.githubUrl) !== null && _e !== void 0 ? _e : null,
            liveUrl: (_f = payload.liveUrl) !== null && _f !== void 0 ? _f : null,
            featured: !!payload.featured,
            status: (_g = payload.status) !== null && _g !== void 0 ? _g : client_1.ProjectStatus.COMPLETED,
            startDate: payload.startDate ? new Date(payload.startDate) : null,
            endDate: payload.endDate ? new Date(payload.endDate) : null,
            author: { connect: { id: Number(payload.authorId) } },
        },
    });
    return created;
});
const getAllFromDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (opts = {}) {
    const page = opts.page && opts.page > 0 ? opts.page : 1;
    const limit = opts.limit && opts.limit > 0 ? opts.limit : 10;
    const where = {};
    if (opts.technology)
        where.technologies = { has: opts.technology };
    if (opts.status)
        where.status = opts.status;
    if (opts.search) {
        where.OR = [
            { title: { contains: opts.search, mode: "insensitive" } },
            { description: { contains: opts.search, mode: "insensitive" } },
            { content: { contains: opts.search, mode: "insensitive" } },
        ];
    }
    const [data, total] = yield db_1.prisma.$transaction([
        db_1.prisma.project.findMany({
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
        db_1.prisma.project.count({ where }),
    ]);
    return { data, total, page, limit };
});
const getProjectById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield db_1.prisma.project.findUnique({
        where: { id },
        include: {
            author: { select: { id: true, name: true, picture: true, title: true } },
        },
    });
    if (!project)
        throw new Error("Project not found");
    return project;
});
const updateProject = (id, payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield db_1.prisma.project.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Project not found");
    if (user &&
        user.role !== "ADMIN" &&
        user.role !== "SUPER_ADMIN" &&
        existing.authorId !== Number(user.id)) {
        throw new Error("Not allowed");
    }
    if (payload.startDate)
        payload.startDate = new Date(payload.startDate);
    if (payload.endDate)
        payload.endDate = new Date(payload.endDate);
    const updated = yield db_1.prisma.project.update({
        where: { id },
        data: payload,
    });
    return updated;
});
const deleteProject = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield db_1.prisma.project.findUnique({ where: { id } });
    if (!existing)
        throw new Error("Project not found");
    if (user &&
        user.role !== "ADMIN" &&
        user.role !== "SUPER_ADMIN" &&
        existing.authorId !== Number(user.id)) {
        throw new Error("Not allowed");
    }
    const deleted = yield db_1.prisma.project.delete({ where: { id } });
    return deleted;
});
const getByAuthor = (authorId) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield db_1.prisma.project.findMany({
        where: { authorId },
        orderBy: { createdAt: "desc" },
    });
    return projects;
});
const getFeatured = () => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield db_1.prisma.project.findMany({
        where: { featured: true },
        orderBy: { createdAt: "desc" },
    });
    return projects;
});
exports.ProjectService = {
    createProject,
    getAllFromDB,
    getProjectById,
    updateProject,
    deleteProject,
    getByAuthor,
    getFeatured,
};
