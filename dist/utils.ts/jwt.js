"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";
// durations from .env or fallback
const ACCESS_TOKEN_EXPIRES = (process.env.ACCESS_TOKEN_EXPIRES ||
    "15d");
const REFRESH_TOKEN_EXPIRES = (process.env.REFRESH_TOKEN_EXPIRES ||
    "30d");
// options with proper type
const accessTokenOptions = { expiresIn: ACCESS_TOKEN_EXPIRES };
const refreshTokenOptions = { expiresIn: REFRESH_TOKEN_EXPIRES };
// token generators
const generateAccessToken = (payload) => jsonwebtoken_1.default.sign(payload, ACCESS_TOKEN_SECRET, accessTokenOptions);
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => jsonwebtoken_1.default.sign(payload, REFRESH_TOKEN_SECRET, refreshTokenOptions);
exports.generateRefreshToken = generateRefreshToken;
const generateTokens = (payload) => ({
    accessToken: (0, exports.generateAccessToken)(payload),
    refreshToken: (0, exports.generateRefreshToken)(payload),
});
exports.generateTokens = generateTokens;
// verifiers
const verifyAccessToken = (token) => jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET);
exports.verifyRefreshToken = verifyRefreshToken;
