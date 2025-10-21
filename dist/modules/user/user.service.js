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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../config/db");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (payload.password) {
        payload.password = yield bcrypt_1.default.hash(payload.password, 10);
    }
    if (payload.role === "ADMIN" || payload.role === "SUPER_ADMIN") {
        const existingOwner = yield db_1.prisma.user.findFirst({
            where: { status: "ACTIVE", role: { in: ["ADMIN", "SUPER_ADMIN"] } },
        });
        if (existingOwner) {
            throw new Error("Only one active owner (ADMIN/SUPER_ADMIN) is allowed.");
        }
    }
    return db_1.prisma.user.create({
        data: Object.assign(Object.assign({}, payload), { skills: (_a = payload.skills) !== null && _a !== void 0 ? _a : [] }),
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
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.prisma.user.findMany({
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
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Lightweight version (counts)
    return db_1.prisma.user.findUnique({
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
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const newPassword = typeof ((_a = payload.password) === null || _a === void 0 ? void 0 : _a.set) === "string"
        ? payload.password.set
        : undefined;
    if (newPassword) {
        payload.password = { set: yield bcrypt_1.default.hash(newPassword, 10) };
    }
    const newRole = typeof ((_b = payload.role) === null || _b === void 0 ? void 0 : _b.set) === "string"
        ? payload.role.set
        : undefined;
    if (newRole === "ADMIN" || newRole === "SUPER_ADMIN") {
        const existingOwner = yield db_1.prisma.user.findFirst({
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
    if (Array.isArray(payload.skills)) {
        payload.skills = { set: payload.skills };
    }
    return db_1.prisma.user.update({
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
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return db_1.prisma.user.delete({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            status: true,
        },
    });
});
exports.UserService = {
    createUser,
    getAllFromDB,
    getUserById,
    updateUser,
    deleteUser,
};
