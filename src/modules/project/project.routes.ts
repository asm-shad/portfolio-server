// src/modules/project/project.routes.ts
import express from "express";
import { ProjectController } from "./project.controller";
import { verifyToken } from "../../utils.ts/auth.middleware";

const router = express.Router();

router.get("/", ProjectController.getAllFromDB); // list + pagination/filter
router.get("/:id", ProjectController.getProjectById); // public

// protected
router.post("/", verifyToken, ProjectController.createProject);
router.patch("/:id", verifyToken, ProjectController.updateProject);
router.delete("/:id", verifyToken, ProjectController.deleteProject);
router.get("/author/:authorId", ProjectController.getByAuthor);
router.get("/featured/list", ProjectController.getFeatured);

export const projectRouter = router;
