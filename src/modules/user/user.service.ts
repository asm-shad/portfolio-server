import bcrypt from "bcrypt";
import { prisma } from "../../config/db";
import { Prisma } from "@prisma/client";

const createUser = async (payload: Prisma.UserCreateInput) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  if (payload.role === "ADMIN" || payload.role === "SUPER_ADMIN") {
    const existingOwner = await prisma.user.findFirst({
      where: { status: "ACTIVE", role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    });
    if (existingOwner) {
      throw new Error("Only one active owner (ADMIN/SUPER_ADMIN) is allowed.");
    }
  }

  return prisma.user.create({
    data: {
      ...payload,
      skills: (payload as any).skills ?? [], // ✅ default
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      picture: true,
      role: true,
      status: true,
      location: true,
      website: true,
      github: true,
      linkedin: true,
      twitter: true,
      skills: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { posts: true, projects: true } },
    },
  });
};

const getAllFromDB = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      picture: true,
      role: true,
      status: true,
      location: true,
      website: true,
      github: true,
      linkedin: true,
      twitter: true,
      skills: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { posts: true, projects: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const getUserById = async (id: number) => {
  // Lightweight version (counts)
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      picture: true,
      role: true,
      status: true,
      location: true,
      website: true,
      github: true,
      linkedin: true,
      twitter: true,
      skills: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { posts: true, projects: true } },
    },
  });

  // Or detailed version:
  // return prisma.user.findUnique({ where: { id }, include: { posts: true, projects: true } });
};

const updateUser = async (id: number, payload: Prisma.UserUpdateInput) => {
  const newPassword =
    typeof (payload as any).password?.set === "string"
      ? (payload as any).password.set
      : undefined;

  if (newPassword) {
    (payload as any).password = { set: await bcrypt.hash(newPassword, 10) };
  }

  const newRole =
    typeof (payload as any).role?.set === "string"
      ? (payload as any).role.set
      : undefined;

  if (newRole === "ADMIN" || newRole === "SUPER_ADMIN") {
    const existingOwner = await prisma.user.findFirst({
      where: {
        status: "ACTIVE",
        role: { in: ["ADMIN", "SUPER_ADMIN"] },
        NOT: { id },
      },
    });
    if (existingOwner) {
      throw new Error("Another active owner already exists.");
    }
  }

  // Normalize skills array if provided as plain array
  if (Array.isArray((payload as any).skills)) {
    (payload as any).skills = { set: (payload as any).skills };
  }

  return prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      picture: true,
      role: true,
      status: true,
      location: true,
      website: true,
      github: true,
      linkedin: true,
      twitter: true,
      skills: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { posts: true, projects: true } }, // ✅
    },
  });
};

const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
    },
  });
};

export const UserService = {
  createUser,
  getAllFromDB,
  getUserById,
  updateUser,
  deleteUser,
};
