// src/bootstrap/seedOwner.ts
import "dotenv/config";
import { prisma } from "../config/db";
import { hashPassword } from "../utils.ts/bcrypt"; // <- make sure path matches your project

type Role = "SUPER_ADMIN" | "ADMIN" | "USER";

export async function seedOwnerIfMissing() {
  const {
    ADMIN_NAME,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_PICTURE,
    ADMIN_TITLE,
    ADMIN_BIO,
    ADMIN_LOCATION,
    ADMIN_WEBSITE,
    ADMIN_GITHUB,
    ADMIN_LINKEDIN,
    ADMIN_TWITTER,
  } = process.env as Record<string, string | undefined>;

  if (!ADMIN_EMAIL) {
    console.warn("⚠️ ADMIN_EMAIL is missing in .env; skipping owner seed.");
    return;
  }

  const OWNER_ROLE: Role = "SUPER_ADMIN";

  // Any active owner present?
  const existingActiveOwner = await prisma.user.findFirst({
    where: { status: "ACTIVE", role: { in: ["ADMIN", "SUPER_ADMIN"] } },
  });

  // If an active owner exists with a different email, just log (don’t kill the server at boot)
  if (existingActiveOwner && existingActiveOwner.email !== ADMIN_EMAIL) {
    console.log(
      `👑 Active owner already exists (${existingActiveOwner.email}). ` +
        `Seed skipped. To change owner, demote/remove the existing owner or change ADMIN_EMAIL.`
    );
    return;
  }

  const baseData = {
    name: ADMIN_NAME ?? "Portfolio Owner",
    email: ADMIN_EMAIL,
    picture: ADMIN_PICTURE || null,
    title: ADMIN_TITLE || null,
    bio: ADMIN_BIO || null,
    location: ADMIN_LOCATION || null,
    website: ADMIN_WEBSITE || null,
    github: ADMIN_GITHUB || null,
    linkedin: ADMIN_LINKEDIN || null,
    twitter: ADMIN_TWITTER || null,
    status: "ACTIVE" as const,
    isVerified: true,
    role: OWNER_ROLE,
  };

  const existingByEmail = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  let passwordHash: string | undefined = undefined;
  if (ADMIN_PASSWORD && ADMIN_PASSWORD.trim().length >= 8) {
    passwordHash = await hashPassword(ADMIN_PASSWORD);
  }

  if (existingByEmail) {
    const updated = await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: {
        ...baseData,
        ...(passwordHash ? { password: passwordHash } : {}),
      },
    });
    console.log(`✅ Owner updated: ${updated.email} (role=${updated.role})`);
  } else {
    const created = await prisma.user.create({
      data: {
        ...baseData,
        ...(passwordHash ? { password: passwordHash } : {}),
      },
    });
    console.log(`✅ Owner created: ${created.email} (role=${created.role})`);
  }
}
