import { prisma } from "../../config/db";
import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateTokens, Tokens, verifyRefreshToken } from "../../utils.ts/jwt";

// Define return types for service methods
interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    picture: string | null;
    role: Role;
    isVerified: boolean;
  };
  tokens: Tokens;
}

const loginWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      picture: true,
      role: true,
      status: true,
      isVerified: true,
    },
  });

  if (!user) throw new Error("User not found!");
  if (!user.password) throw new Error("This account uses social login only.");
  if (user.status !== "ACTIVE") throw new Error("Account is not active.");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Incorrect password!");

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
      isVerified: user.isVerified,
    },
    tokens,
  };
};

const authWithGoogle = async (
  data: Prisma.UserCreateInput
): Promise<AuthResponse> => {
  let user = await prisma.user.findUnique({
    where: { email: data.email },
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      role: true,
      status: true,
      isVerified: true,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: data.email!,
        name: data.name,
        picture: data.picture,
        password: null,
        isVerified: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        role: true,
        status: true,
        isVerified: true,
      },
    });
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Account is not active.");
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
      isVerified: user.isVerified,
    },
    tokens,
  };
};

const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
        role: true,
        status: true,
        isVerified: true,
      },
    });

    if (!user || user.status !== "ACTIVE") {
      throw new Error("Invalid refresh token");
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
        isVerified: user.isVerified,
      },
      tokens,
    };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

const getCurrentUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      picture: true,
      role: true,
      status: true,
      isVerified: true,
      bio: true,
      title: true,
      location: true,
      website: true,
      github: true,
      linkedin: true,
      twitter: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const AuthService = {
  loginWithEmailAndPassword,
  authWithGoogle,
  refreshToken,
  getCurrentUser,
};
