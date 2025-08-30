const exportService = require("../services/exportService");

class ExportController {
  async exportProject(req, res) {
    try {
      const { components, settings = {}, format = "html" } = req.body;

      // Validation
      if (!components || !Array.isArray(components)) {
        return res.status(400).json({ error: "Components array is required" });
      }

      const supportedFormats = ["html", "react", "vue"];
      if (!supportedFormats.includes(format)) {
        return res.status(400).json({
          error: "Unsupported format",
          supported_formats: supportedFormats,
        });
      }

      const result = await exportService.exportProject(
        components,
        settings,
        format
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({
        error: "Export failed",
        message: error.message,
      });
    }
  }

  async downloadExport(req, res) {
    try {
      const { components, settings = {}, format = "html" } = req.body;

      if (!components || !Array.isArray(components)) {
        return res.status(400).json({ error: "Components array is required" });
      }

      const result = await exportService.exportProject(
        components,
        settings,
        format
      );

      // Set headers for file download
      res.setHeader("Content-Type", result.mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${result.filename}"`
      );
      res.setHeader("Cache-Control", "no-cache");

      res.send(result.code);
    } catch (error) {
      console.error("Download error:", error);
      res.status(500).json({
        error: "Download failed",
        message: error.message,
      });
    }
  }

  async generatePreview(req, res) {
    try {
      const { components, settings = {} } = req.body;

      if (!components || !Array.isArray(components)) {
        return res.status(400).json({ error: "Components array is required" });
      }

      const result = await exportService.exportProject(
        components,
        settings,
        "html"
      );

      res.json({
        success: true,
        preview_url: result.previewUrl,
        timestamp: result.timestamp,
      });
    } catch (error) {
      console.error("Preview generation error:", error);
      res.status(500).json({
        error: "Preview generation failed",
        message: error.message,
      });
    }
  }

  async getExportFormats(req, res) {
    try {
      const formats = [
        {
          name: "html",
          display_name: "HTML",
          description: "Static HTML file with inline CSS and JavaScript",
          file_extension: ".html",
          supported: true,
        },
        {
          name: "react",
          display_name: "React Component",
          description: "React JSX component file",
          file_extension: ".jsx",
          supported: true,
        },
        {
          name: "vue",
          display_name: "Vue Component",
          description: "Vue single-file component",
          file_extension: ".vue",
          supported: true,
        },
        {
          name: "angular",
          display_name: "Angular Component",
          description: "Angular component with TypeScript",
          file_extension: ".ts",
          supported: false,
          coming_soon: true,
        },
      ];

      res.json({
        formats,
        default_format: "html",
      });
    } catch (error) {
      console.error("Error fetching export formats:", error);
      res.status(500).json({
        error: "Failed to fetch export formats",
        message: error.message,
      });
    }
  }
}

module.exports = new ExportController();
