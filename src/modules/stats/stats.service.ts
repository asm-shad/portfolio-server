import { prisma } from "../../config/db";

export const StatsService = {
  async getDashboardStats() {
    const [
      totalPosts,
      totalProjects,
      recentPosts,
      recentProjects,
      mostViewedPosts,
      mostViewedPostSingle,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.project.count(),

      prisma.post.findMany({
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

      prisma.project.findMany({
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
      prisma.post.findMany({
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
      prisma.post.findFirst({
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
  },
};
