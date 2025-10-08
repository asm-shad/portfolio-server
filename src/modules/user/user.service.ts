import bcrypt from "bcrypt";
import { prisma } from "../../config/db";
import { Prisma } from "@prisma/client";

const createUser = async (payload: Prisma.UserCreateInput) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }

  // Enforce single owner on create
  if (payload.role === "ADMIN" || payload.role === "SUPER_ADMIN") {
    const existingOwner = await prisma.user.findFirst({
      where: { status: "ACTIVE", role: { in: ["ADMIN", "SUPER_ADMIN"] } },
    });
    if (existingOwner) {
      throw new Error("Only one active owner (ADMIN/SUPER_ADMIN) is allowed.");
    }
  }

  // Return only safe fields
  return prisma.user.create({
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      picture: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      // password intentionally omitted
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
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

const getUserById = async (id: number) => {
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
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Safer update:
 * - Re-hash password if provided
 * - Enforce single-owner rule on role updates
 * - Never return password in response
 * - Prefer Prisma.UserUpdateInput typing
 */
const updateUser = async (id: number, payload: Prisma.UserUpdateInput) => {
  // If password is being updated, hash it
  // payload.password can be { set: string } or undefined depending on how you call it
  const newPassword =
    typeof (payload as any).password?.set === "string"
      ? (payload as any).password.set
      : undefined;

  if (newPassword) {
    (payload as any).password = { set: await bcrypt.hash(newPassword, 10) };
  }

  // If promoting to ADMIN/SUPER_ADMIN, enforce single owner
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
      createdAt: true,
      updatedAt: true,
      // password intentionally omitted
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
