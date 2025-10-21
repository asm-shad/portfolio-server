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
exports.seedOwnerIfMissing = seedOwnerIfMissing;
require("dotenv/config");
const db_1 = require("../config/db");
const bcrypt_1 = require("../utils.ts/bcrypt");
function seedOwnerIfMissing() {
    return __awaiter(this, void 0, void 0, function* () {
        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PICTURE, ADMIN_TITLE, ADMIN_BIO, ADMIN_LOCATION, ADMIN_WEBSITE, ADMIN_GITHUB, ADMIN_LINKEDIN, ADMIN_TWITTER, ADMIN_SKILLS, } = process.env;
        if (!ADMIN_EMAIL) {
            console.warn("⚠️ ADMIN_EMAIL is missing in .env; skipping owner seed.");
            return;
        }
        const OWNER_ROLE = "SUPER_ADMIN";
        const existingActiveOwner = yield db_1.prisma.user.findFirst({
            where: { status: "ACTIVE", role: { in: ["ADMIN", "SUPER_ADMIN"] } },
        });
        if (existingActiveOwner && existingActiveOwner.email !== ADMIN_EMAIL) {
            console.log(`👑 Active owner already exists (${existingActiveOwner.email}). Seed skipped.`);
            return;
        }
        // ✅ parse skills safely
        const parsedSkills = ADMIN_SKILLS
            ? ADMIN_SKILLS.split(",").map((s) => s.trim())
            : [];
        const baseData = {
            name: ADMIN_NAME !== null && ADMIN_NAME !== void 0 ? ADMIN_NAME : "Portfolio Owner",
            email: ADMIN_EMAIL,
            picture: ADMIN_PICTURE || null,
            title: ADMIN_TITLE || null,
            bio: ADMIN_BIO || null,
            location: ADMIN_LOCATION || null,
            website: ADMIN_WEBSITE || null,
            github: ADMIN_GITHUB || null,
            linkedin: ADMIN_LINKEDIN || null,
            twitter: ADMIN_TWITTER || null,
            skills: parsedSkills,
            status: "ACTIVE",
            isVerified: true,
            role: OWNER_ROLE,
        };
        const existingByEmail = yield db_1.prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
        });
        let passwordHash;
        if (ADMIN_PASSWORD && ADMIN_PASSWORD.trim().length >= 8) {
            passwordHash = yield (0, bcrypt_1.hashPassword)(ADMIN_PASSWORD);
        }
        if (existingByEmail) {
            const updated = yield db_1.prisma.user.update({
                where: { email: ADMIN_EMAIL },
                data: Object.assign(Object.assign({}, baseData), (passwordHash ? { password: passwordHash } : {})),
            });
            console.log(`✅ Owner updated: ${updated.email} (role=${updated.role})`);
        }
        else {
            const created = yield db_1.prisma.user.create({
                data: Object.assign(Object.assign({}, baseData), (passwordHash ? { password: passwordHash } : {})),
            });
            console.log(`✅ Owner created: ${created.email} (role=${created.role})`);
        }
    });
}
