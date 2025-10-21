"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
// src/modules/post/post.routes.ts
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("./post.controller");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
router.get("/", post_controller_1.PostController.getAllFromDB); // public + supports pagination/filter
router.get("/slug/:slug", post_controller_1.PostController.getPostBySlug); // public
router.get("/:id", post_controller_1.PostController.getPostById); // public
// protected routes (owner/admin)
router.post("/", auth_1.verifyToken, post_controller_1.PostController.createPost);
router.patch("/:id", auth_1.verifyToken, post_controller_1.PostController.updatePost);
router.patch("/:id/publish", auth_1.verifyToken, post_controller_1.PostController.publishPost);
router.patch("/:id/unpublish", auth_1.verifyToken, post_controller_1.PostController.unpublishPost);
router.patch("/:id/views", post_controller_1.PostController.incrementViews);
router.delete("/:id", auth_1.verifyToken, post_controller_1.PostController.deletePost);
exports.postRouter = router;
