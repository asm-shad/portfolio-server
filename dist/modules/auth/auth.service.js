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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = require("../../config/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../utils.ts/jwt");
const loginWithEmailAndPassword = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, password, }) {
    const user = yield db_1.prisma.user.findUnique({
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
    if (!user)
        throw new Error("User not found!");
    if (!user.password)
        throw new Error("This account uses social login only.");
    if (user.status !== "ACTIVE")
        throw new Error("Account is not active.");
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid)
        throw new Error("Incorrect password!");
    const tokens = (0, jwt_1.generateTokens)({
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
});
const authWithGoogle = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield db_1.prisma.user.findUnique({
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
        user = yield db_1.prisma.user.create({
            data: {
                email: data.email,
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
    const tokens = (0, jwt_1.generateTokens)({
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
});
const refreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const user = yield db_1.prisma.user.findUnique({
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
        const tokens = (0, jwt_1.generateTokens)({
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
    }
    catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
});
const getCurrentUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.findUnique({
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
});
exports.AuthService = {
    loginWithEmailAndPassword,
    authWithGoogle,
    refreshToken,
    getCurrentUser,
};
