const Template = require("../models/Template");

class TemplateController {
  async getAllTemplates(req, res) {
    try {
      const { category, page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const templates = await Template.findAll({
        category,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      res.json({
        templates: templates.map((template) => template.toJSON()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({
        error: "Failed to fetch templates",
        message: error.message,
      });
    }
  }

  async getTemplateById(req, res) {
    try {
      const { id } = req.params;
      const template = await Template.findById(id);

      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template.toJSON());
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({
        error: "Failed to fetch template",
        message: error.message,
      });
    }
  }

  async getTemplateCategories(req, res) {
    try {
      const categories = await Template.getCategories();

      res.json({
        categories,
        count: categories.length,
      });
    } catch (error) {
      console.error("Error fetching template categories:", error);
      res.status(500).json({
        error: "Failed to fetch template categories",
        message: error.message,
      });
    }
  }

  async createTemplate(req, res) {
    try {
      const {
        name,
        description,
        category,
        components,
        thumbnail,
        is_public = true,
      } = req.body;

      // Validation
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ error: "Template name is required" });
      }

      if (
        !components ||
        !Array.isArray(components) ||
        components.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Template components are required" });
      }

      const templateData = {
        name: name.trim(),
        description: description?.trim() || "",
        category: category || "general",
        components,
        thumbnail,
        is_public: is_public ? 1 : 0,
      };

      const template = await Template.create(templateData);

      res.status(201).json(template.toJSON());
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({
        error: "Failed to create template",
        message: error.message,
      });
    }
  }
}

module.exports = new TemplateController();
