const express = require("express");
const templateController = require("../controllers/templateController");

const router = express.Router();

// GET /api/templates - Get all templates with filtering
router.get("/", templateController.getAllTemplates);

// GET /api/templates/categories - Get template categories
router.get("/categories", templateController.getTemplateCategories);

// POST /api/templates - Create a new template
router.post("/", templateController.createTemplate);

// GET /api/templates/:id - Get a specific template by ID
router.get("/:id", templateController.getTemplateById);

module.exports = router;
