const aiService = require("../services/aiService");

class AIController {
  async generateComponent(req, res) {
    try {
      const { prompt, type = "component", context = {} } = req.body;

      // Validation
      if (!prompt || prompt.trim().length === 0) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (prompt.length > 1000) {
        return res
          .status(400)
          .json({ error: "Prompt must be less than 1000 characters" });
      }

      const validTypes = ["component", "layout", "suggestion"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          error: "Invalid type. Must be one of: component, layout, suggestion",
        });
      }

      const response = await aiService.generateComponent(
        prompt.trim(),
        type,
        context
      );

      res.json({
        success: true,
        ...response,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("AI generation error:", error);
      res.status(500).json({
        error: "AI generation failed",
        message: error.message,
      });
    }
  }

  async getGenerationHistory(req, res) {
    try {
      const { limit = 10 } = req.query;

      const AIInteraction = require("../models/AIInteraction");
      const interactions = await AIInteraction.getRecentInteractions(
        parseInt(limit)
      );

      res.json({
        interactions: interactions.map((interaction) => interaction.toJSON()),
        count: interactions.length,
      });
    } catch (error) {
      console.error("Error fetching AI history:", error);
      res.status(500).json({
        error: "Failed to fetch generation history",
        message: error.message,
      });
    }
  }

  async getAIStats(req, res) {
    try {
      const AIInteraction = require("../models/AIInteraction");
      const stats = await AIInteraction.getInteractionStats();

      res.json({
        stats,
        ai_provider: aiService.genAI ? "Google Gemini" : "Mock System",
        features_enabled: {
          real_ai: !!aiService.genAI,
          generation_history: true,
          context_awareness: true,
        },
      });
    } catch (error) {
      console.error("Error fetching AI stats:", error);
      res.status(500).json({
        error: "Failed to fetch AI statistics",
        message: error.message,
      });
    }
  }

  async generateMultiple(req, res) {
    try {
      const { prompts, type = "component", context = {} } = req.body;

      if (!Array.isArray(prompts) || prompts.length === 0) {
        return res.status(400).json({ error: "Prompts array is required" });
      }

      if (prompts.length > 5) {
        return res
          .status(400)
          .json({ error: "Maximum 5 prompts allowed per request" });
      }

      const responses = await Promise.all(
        prompts.map((prompt) =>
          aiService.generateComponent(prompt.trim(), type, context)
        )
      );

      res.json({
        success: true,
        results: responses,
        count: responses.length,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Multiple AI generation error:", error);
      res.status(500).json({
        error: "Multiple AI generation failed",
        message: error.message,
      });
    }
  }

  async generateWithTemplate(req, res) {
    try {
      const { templateType, customizations = {}, context = {} } = req.body;

      const templatePrompts = {
        landing:
          "Create a complete landing page with hero section, features, and call to action",
        portfolio:
          "Generate a portfolio website with header, projects section, and contact form",
        business:
          "Build a business website with navigation, services section, and footer",
        blog: "Create a blog layout with header, article preview cards, and sidebar",
        ecommerce:
          "Generate an e-commerce page with product grid and shopping features",
      };

      if (!templatePrompts[templateType]) {
        return res.status(400).json({
          error: "Invalid template type",
          available_templates: Object.keys(templatePrompts),
        });
      }

      let prompt = templatePrompts[templateType];

      // Apply customizations
      if (customizations.businessName) {
        prompt += ` for "${customizations.businessName}"`;
      }
      if (customizations.industry) {
        prompt += ` in the ${customizations.industry} industry`;
      }
      if (customizations.colorScheme) {
        prompt += ` using ${customizations.colorScheme} colors`;
      }

      const response = await aiService.generateComponent(
        prompt,
        "layout",
        context
      );

      res.json({
        success: true,
        template_type: templateType,
        customizations,
        ...response,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Template generation error:", error);
      res.status(500).json({
        error: "Template generation failed",
        message: error.message,
      });
    }
  }
}

module.exports = new AIController();
