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
exports.PostController = void 0;
const post_service_1 = require("./post.service");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        // Use the authenticated user's ID
        payload.authorId = req.user.id;
        const result = yield post_service_1.PostService.createPost(payload);
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
});
const getAllFromDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = req.query;
        const result = yield post_service_1.PostService.getAllFromDB({
            page: Number(q.page) || 1,
            limit: Number(q.limit) || 10,
            tag: q.tag,
            authorId: q.authorId ? Number(q.authorId) : undefined,
            publishedOnly: q.published === "true" ? true : undefined,
            search: q.search,
        });
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield post_service_1.PostService.getPostById(Number(req.params.id));
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
});
const getPostBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield post_service_1.PostService.getPostBySlug(req.params.slug);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
});
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check authentication
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const result = yield post_service_1.PostService.updatePost(Number(req.params.id), req.body, req.user);
        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
});
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check authentication
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const result = yield post_service_1.PostService.deletePost(Number(req.params.id), req.user);
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
});
const publishPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check authentication
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const result = yield post_service_1.PostService.publishPost(Number(req.params.id), req.user);
        res.status(200).json({
            success: true,
            message: "Post published successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
});
const unpublishPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check authentication
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const result = yield post_service_1.PostService.unpublishPost(Number(req.params.id), req.user);
        res.status(200).json({
            success: true,
            message: "Post unpublished successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
});
const incrementViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield post_service_1.PostService.incrementViews(Number(req.params.id));
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal server error",
        });
    }
});
exports.PostController = {
    createPost,
    getAllFromDB,
    getPostById,
    getPostBySlug,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    incrementViews,
};
