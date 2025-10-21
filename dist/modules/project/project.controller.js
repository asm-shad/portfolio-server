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
exports.ProjectController = void 0;
const project_service_1 = require("./project.service");
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const payload = req.body;
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)
            payload.authorId = Number(req.user.id);
        const result = yield project_service_1.ProjectService.createProject(payload);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : error);
    }
});
const getAllFromDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const q = req.query;
        const result = yield project_service_1.ProjectService.getAllFromDB({
            page: Number(q.page) || 1,
            limit: Number(q.limit) || 10,
            technology: q.technology,
            status: (_a = q.status) !== null && _a !== void 0 ? _a : undefined,
            search: q.search,
        });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : error);
    }
});
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield project_service_1.ProjectService.getProjectById(Number(req.params.id));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : error);
    }
});
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield project_service_1.ProjectService.updateProject(Number(req.params.id), req.body, req.user);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : error);
    }
});
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield project_service_1.ProjectService.deleteProject(Number(req.params.id), req.user);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : error);
    }
});
const getByAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield project_service_1.ProjectService.getByAuthor(Number(req.params.authorId));
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : error);
    }
});
const getFeatured = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield project_service_1.ProjectService.getFeatured();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : error);
    }
});
exports.ProjectController = {
    createProject,
    getAllFromDB,
    getProjectById,
    updateProject,
    deleteProject,
    getByAuthor,
    getFeatured,
};
