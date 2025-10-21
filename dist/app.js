"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = require("./modules/user/user.routes");
const auth_routes_1 = require("./modules/auth/auth.routes");
const post_routes_1 = require("./modules/post/post.routes");
const project_routes_1 = require("./modules/project/project.routes");
const stats_route_1 = require("./modules/stats/stats.route");
const app = (0, express_1.default)();
// ===== CORS SETUP =====
const ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://asmshadportfolio.vercel.app",
    // add any other custom domains here
];
app.use((0, cors_1.default)({
    origin: (origin, cb) => {
        // allow non-browser/SSR/health checks (no Origin header)
        if (!origin)
            return cb(null, true);
        const isExactAllowed = ALLOWED_ORIGINS.includes(origin);
        const isVercelPreview = /^https:\/\/.*\.vercel\.app$/.test(origin); // preview deployments
        if (isExactAllowed || isVercelPreview)
            return cb(null, true);
        return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true, // set to true only if you actually use cookies
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// ===== COMMON MIDDLEWARE =====
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, compression_1.default)());
// ===== ROUTES =====
app.use("/api/user", user_routes_1.userRouter);
app.use("/api/post", post_routes_1.postRouter);
app.use("/api/auth", auth_routes_1.authRouter);
app.use("/api/project", project_routes_1.projectRouter);
app.use("/api/stats", stats_route_1.StatsRoutes);
app.get("/", (_req, res) => {
    res.send("API is running");
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});
exports.default = app;
