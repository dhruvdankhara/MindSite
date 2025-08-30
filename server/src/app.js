require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");

// Import configuration and utilities
const config = require("./config");
const logger = require("./utils/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");
const { sanitizeInput } = require("./middleware/validation");

// Import routes
const apiRoutes = require("./routes");

// Initialize database
require("./config/database");

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.tailwindcss.com",
          "https://fonts.googleapis.com",
        ],
        scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Compression middleware
app.use(compression());

// Logging middleware
if (config.server.env === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// CORS middleware
app.use(cors(config.cors));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Input sanitization
app.use(sanitizeInput);

// Rate limiting
app.use(apiLimiter);

// Serve static files for previews
app.use("/previews", express.static(path.join(__dirname, "../previews")));

// API routes
app.use("/api", apiRoutes);

// Health check endpoint (outside of rate limiting)
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "AI Website Builder API is running",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    environment: config.server.env,
    features: {
      ai_generation: config.features.aiGeneration,
      user_auth: config.features.userAuthentication,
      collaboration: config.features.projectCollaboration,
      analytics: config.features.analytics,
    },
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "AI Website Builder API",
    version: "2.0.0",
    description: "A powerful API for building websites with AI assistance",
    documentation: "/api",
    health: "/health",
    features: {
      "Project Management": "Create, update, and manage website projects",
      "AI Generation": "Generate components and layouts using AI",
      "Export System": "Export to HTML, React, Vue, and more",
      "Template Library": "Pre-built templates and components",
      "Real-time Preview": "Live preview of generated websites",
    },
    endpoints: {
      api: "/api",
      projects: "/api/projects",
      ai: "/api/ai",
      export: "/api/export",
      templates: "/api/templates",
    },
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

  const { closeDatabase } = require("./config/database");
  closeDatabase();

  process.exit(0);
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection:", { reason, promise });
  process.exit(1);
});

// Start server
const PORT = config.server.port;
const server = app.listen(PORT, () => {
  console.log("");
  console.log("🚀 ======================================");
  console.log("   AI Website Builder API v2.0");
  console.log("🚀 ======================================");
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${config.server.env}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
  console.log(
    `🤖 AI Provider: ${
      config.ai.geminiApiKey !== "demo-key"
        ? "Google Gemini"
        : "Enhanced Mock System"
    }`
  );
  console.log(`💾 Database: SQLite`);
  console.log(`🔒 CORS Origin: ${config.cors.origin}`);
  console.log("");

  if (config.ai.geminiApiKey === "demo-key") {
    console.log(
      "⚠️  Warning: Using demo AI key. Set GEMINI_API_KEY for real AI generation."
    );
  }

  console.log("✅ Server is ready to accept requests!");
  console.log("======================================");
});

// Export for testing
module.exports = app;
