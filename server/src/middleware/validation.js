// Request validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((detail) => ({
          field: detail.path.join("."),
          message: detail.message,
        })),
      });
    }
    next();
  };
};

// Validate pagination parameters
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({ error: "Page must be a positive integer" });
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({ error: "Limit must be between 1 and 100" });
  }

  next();
};

// Validate project data
const validateProject = (req, res, next) => {
  const { name, components, settings } = req.body;

  if (
    req.method === "POST" &&
    (!name || typeof name !== "string" || name.trim().length === 0)
  ) {
    return res.status(400).json({ error: "Project name is required" });
  }

  if (name && typeof name !== "string") {
    return res.status(400).json({ error: "Project name must be a string" });
  }

  if (name && name.length > 100) {
    return res
      .status(400)
      .json({ error: "Project name must be less than 100 characters" });
  }

  if (components && !Array.isArray(components)) {
    return res.status(400).json({ error: "Components must be an array" });
  }

  if (settings && typeof settings !== "object") {
    return res.status(400).json({ error: "Settings must be an object" });
  }

  next();
};

// Validate AI generation request
const validateAIRequest = (req, res, next) => {
  const { prompt, type, context } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (prompt.length > 1000) {
    return res
      .status(400)
      .json({ error: "Prompt must be less than 1000 characters" });
  }

  const validTypes = ["component", "layout", "suggestion"];
  if (type && !validTypes.includes(type)) {
    return res.status(400).json({
      error: "Invalid type",
      validTypes,
    });
  }

  if (context && typeof context !== "object") {
    return res.status(400).json({ error: "Context must be an object" });
  }

  next();
};

// Validate export request
const validateExportRequest = (req, res, next) => {
  const { components, format, settings } = req.body;

  if (!components || !Array.isArray(components)) {
    return res.status(400).json({ error: "Components array is required" });
  }

  if (components.length === 0) {
    return res
      .status(400)
      .json({ error: "At least one component is required" });
  }

  const validFormats = ["html", "react", "vue"];
  if (format && !validFormats.includes(format)) {
    return res.status(400).json({
      error: "Invalid format",
      validFormats,
    });
  }

  if (settings && typeof settings !== "object") {
    return res.status(400).json({ error: "Settings must be an object" });
  }

  next();
};

// Sanitize input data
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    // Remove any potential XSS in string fields
    const sanitizeString = (str) => {
      if (typeof str !== "string") return str;
      return str
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<[^>]+>/g, "")
        .trim();
    };

    const sanitizeObject = (obj) => {
      if (typeof obj !== "object" || obj === null) return obj;

      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }

      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "string") {
          sanitized[key] = sanitizeString(value);
        } else if (typeof value === "object") {
          sanitized[key] = sanitizeObject(value);
        } else {
          sanitized[key] = value;
        }
      }
      return sanitized;
    };

    req.body = sanitizeObject(req.body);
  }

  next();
};

module.exports = {
  validateRequest,
  validatePagination,
  validateProject,
  validateAIRequest,
  validateExportRequest,
  sanitizeInput,
};
