"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRouter = void 0;
// src/modules/project/project.routes.ts
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("./project.controller");
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
router.get("/", project_controller_1.ProjectController.getAllFromDB); // list + pagination/filter
router.get("/:id", project_controller_1.ProjectController.getProjectById); // public
// protected
router.post("/", auth_1.verifyToken, project_controller_1.ProjectController.createProject);
router.patch("/:id", auth_1.verifyToken, project_controller_1.ProjectController.updateProject);
router.delete("/:id", auth_1.verifyToken, project_controller_1.ProjectController.deleteProject);
router.get("/author/:authorId", project_controller_1.ProjectController.getByAuthor);
router.get("/featured/list", project_controller_1.ProjectController.getFeatured);
exports.projectRouter = router;
