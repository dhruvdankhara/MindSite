const express = require("express");
const exportController = require("../controllers/exportController");

const router = express.Router();

// POST /api/export - Export project and return code with preview
router.post("/", exportController.exportProject);

// POST /api/export/download - Export and download file directly
router.post("/download", exportController.downloadExport);

// POST /api/export/preview - Generate preview only
router.post("/preview", exportController.generatePreview);

// GET /api/export/formats - Get available export formats
router.get("/formats", exportController.getExportFormats);

module.exports = router;
