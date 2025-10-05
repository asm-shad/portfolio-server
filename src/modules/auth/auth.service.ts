import { prisma } from "../../config/db";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateTokens } from "../../utils.ts/jwt";

const loginWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found!");
  if (!user.password) throw new Error("This account uses social login only.");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Incorrect password!");

  // Generate JWT tokens
  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
    },
    tokens,
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
        password: null, // for social login users
      },
    });
  }

  const tokens = generateTokens({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
    },
    tokens,
  };
};

export const AuthService = {
  loginWithEmailAndPassword,
  authWithGoogle,
};
