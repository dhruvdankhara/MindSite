const express = require("express");
const aiController = require("../controllers/aiController");

const router = express.Router();

// POST /api/ai/generate - Generate a single component
router.post("/generate", aiController.generateComponent);

// POST /api/ai/generate/multiple - Generate multiple components
router.post("/generate/multiple", aiController.generateMultiple);

// POST /api/ai/generate/template - Generate from template
router.post("/generate/template", aiController.generateWithTemplate);

// GET /api/ai/history - Get generation history
router.get("/history", aiController.getGenerationHistory);

// GET /api/ai/stats - Get AI statistics
router.get("/stats", aiController.getAIStats);

module.exports = router;
