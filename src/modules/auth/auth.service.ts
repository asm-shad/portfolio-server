import { prisma } from "../../config/db";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const loginWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found!");
  }

  if (!user.password) {
    throw new Error("This account uses social login only.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Incorrect password!");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    role: user.role,
  };
};

const authWithGoogle = async (data: Prisma.UserCreateInput) => {
  let user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: data.email!,
        name: data.name,
        picture: data.picture,
        password: null, // Social login user
      },
    });
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    role: user.role,
  };
};

export const AuthService = {
  loginWithEmailAndPassword,
  authWithGoogle,
};
