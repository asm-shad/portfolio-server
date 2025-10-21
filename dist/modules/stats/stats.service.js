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
exports.StatsService = void 0;
const db_1 = require("../../config/db");
exports.StatsService = {
    getDashboardStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [totalPosts, totalProjects, recentPosts, recentProjects, mostViewedPosts, mostViewedPostSingle,] = yield Promise.all([
                db_1.prisma.post.count(),
                db_1.prisma.project.count(),
                db_1.prisma.post.findMany({
                    where: { isPublished: true },
                    orderBy: { createdAt: "desc" },
                    take: 8,
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        createdAt: true,
                        views: true,
                        isPublished: true,
                    },
                }),
                db_1.prisma.project.findMany({
                    orderBy: { createdAt: "desc" },
                    take: 8,
                    select: {
                        id: true,
                        title: true,
                        createdAt: true,
                        status: true,
                    },
                }),
                // 👇 Most viewed list
                db_1.prisma.post.findMany({
                    where: { isPublished: true },
                    orderBy: { views: "desc" },
                    take: 8,
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        views: true,
                        createdAt: true,
                        thumbnail: true,
                    },
                }),
                // 👇 Single most viewed (for a highlight card)
                db_1.prisma.post.findFirst({
                    where: { isPublished: true },
                    orderBy: { views: "desc" },
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        views: true,
                        createdAt: true,
                        thumbnail: true,
                    },
                }),
            ]);
            return {
                totals: {
                    posts: totalPosts,
                    projects: totalProjects,
                },
                recentPosts,
                recentProjects,
                mostViewed: {
                    list: mostViewedPosts,
                    top: mostViewedPostSingle,
                },
            };
        });
    },
};
