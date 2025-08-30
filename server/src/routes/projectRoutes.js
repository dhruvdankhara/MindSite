const express = require("express");
const projectController = require("../controllers/projectController");

const router = express.Router();

// GET /api/projects - Get all projects with pagination and search
router.get("/", projectController.getAllProjects);

// POST /api/projects - Create a new project
router.post("/", projectController.createProject);

// GET /api/projects/:id - Get a specific project by ID
router.get("/:id", projectController.getProjectById);

// PUT /api/projects/:id - Update a project
router.put("/:id", projectController.updateProject);

// DELETE /api/projects/:id - Delete a project
router.delete("/:id", projectController.deleteProject);

// POST /api/projects/:id/duplicate - Duplicate a project
router.post("/:id/duplicate", projectController.duplicateProject);

module.exports = router;
