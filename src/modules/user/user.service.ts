import { prisma } from "../../config/db";
import { Prisma, User } from "@prisma/client";

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
  return prisma.user.create({ data: payload });
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

const updateUser = async (id: number, payload: Partial<User>) => {
  return prisma.user.update({
    where: { id },
    data: payload,
  });
};

const deleteUser = async (id: number) => {
  return prisma.user.delete({ where: { id } });
};

export const UserService = {
  createUser,
  getAllFromDB,
  getUserById,
  updateUser,
  deleteUser,
};
