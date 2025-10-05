import jwt, { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

// durations from .env or fallback
const ACCESS_TOKEN_EXPIRES = (process.env.ACCESS_TOKEN_EXPIRES ||
  "15d") as StringValue;
const REFRESH_TOKEN_EXPIRES = (process.env.REFRESH_TOKEN_EXPIRES ||
  "30d") as StringValue;

// options with proper type
const accessTokenOptions: SignOptions = { expiresIn: ACCESS_TOKEN_EXPIRES };
const refreshTokenOptions: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRES };

// token generators
export const generateAccessToken = (payload: object) =>
  jwt.sign(payload as jwt.JwtPayload, ACCESS_TOKEN_SECRET, accessTokenOptions);

export const generateRefreshToken = (payload: object) =>
  jwt.sign(
    payload as jwt.JwtPayload,
    REFRESH_TOKEN_SECRET,
    refreshTokenOptions
  );

export const generateTokens = (payload: object) => ({
  accessToken: generateAccessToken(payload),
  refreshToken: generateRefreshToken(payload),
});

// verifiers
export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
