const express = require("express");
const projectRoutes = require("./projectRoutes");
const aiRoutes = require("./aiRoutes");
const exportRoutes = require("./exportRoutes");
const templateRoutes = require("./templateRoutes");

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "AI Website Builder API is running",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
  });
});

// API routes
router.use("/projects", projectRoutes);
router.use("/ai", aiRoutes);
router.use("/export", exportRoutes);
router.use("/templates", templateRoutes);

// API documentation endpoint
router.get("/", (req, res) => {
  res.json({
    name: "AI Website Builder API",
    version: "2.0.0",
    description: "RESTful API for the AI-powered website builder",
    endpoints: {
      projects: {
        "GET /api/projects": "Get all projects with pagination",
        "POST /api/projects": "Create a new project",
        "GET /api/projects/:id": "Get project by ID",
        "PUT /api/projects/:id": "Update project",
        "DELETE /api/projects/:id": "Delete project",
        "POST /api/projects/:id/duplicate": "Duplicate project",
      },
      ai: {
        "POST /api/ai/generate": "Generate component with AI",
        "POST /api/ai/generate/multiple": "Generate multiple components",
        "POST /api/ai/generate/template": "Generate from template",
        "GET /api/ai/history": "Get generation history",
        "GET /api/ai/stats": "Get AI statistics",
      },
      export: {
        "POST /api/export": "Export project to code",
        "POST /api/export/download": "Download exported file",
        "POST /api/export/preview": "Generate preview only",
        "GET /api/export/formats": "Get export formats",
      },
      templates: {
        "GET /api/templates": "Get all templates",
        "GET /api/templates/categories": "Get template categories",
        "POST /api/templates": "Create template",
        "GET /api/templates/:id": "Get template by ID",
      },
    },
    documentation: "https://docs.ai-website-builder.com",
  });
});

module.exports = router;
