require("dotenv").config();

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    host: process.env.HOST || "localhost",
    env: process.env.NODE_ENV || "development",
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  },

  // Database configuration
  database: {
    type: "sqlite",
    filename: process.env.DB_FILENAME || "database.sqlite",
    logging: process.env.DB_LOGGING === "true",
  },

  // AI configuration
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || "demo-key",
    provider: process.env.AI_PROVIDER || "gemini",
    model: process.env.AI_MODEL || "gemini-2.5-flash",
    maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 8192,
    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
    generationConfig: {
      temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
      topK: parseInt(process.env.AI_TOP_K) || 40,
      topP: parseFloat(process.env.AI_TOP_P) || 0.95,
      maxOutputTokens: parseInt(process.env.AI_MAX_TOKENS) || 8192,
    },
  },

  // Security configuration
  security: {
    jwtSecret:
      process.env.JWT_SECRET ||
      "your-super-secret-jwt-key-change-in-production",
    jwtExpiration: process.env.JWT_EXPIRATION || "7d",
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    rateLimitWindowMs:
      parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100, // limit each IP to 100 requests per windowMs
  },

  // File upload configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    uploadPath: process.env.UPLOAD_PATH || "./uploads",
  },

  // Email configuration (for future features)
  email: {
    provider: process.env.EMAIL_PROVIDER || "smtp",
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
    },
  },

  // Cache configuration
  cache: {
    enabled: process.env.CACHE_ENABLED === "true",
    ttl: parseInt(process.env.CACHE_TTL) || 300, // 5 minutes
    maxSize: parseInt(process.env.CACHE_MAX_SIZE) || 100,
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "combined",
    file: process.env.LOG_FILE || null,
  },

  // Feature flags
  features: {
    aiGeneration: process.env.FEATURE_AI_GENERATION !== "false",
    userAuthentication: process.env.FEATURE_USER_AUTH === "true",
    projectCollaboration: process.env.FEATURE_PROJECT_COLLABORATION === "true",
    analytics: process.env.FEATURE_ANALYTICS === "true",
    exportToCloud: process.env.FEATURE_EXPORT_TO_CLOUD === "true",
  },
};

// Validation
function validateConfig() {
  const requiredEnvVars = [];

  if (config.features.aiGeneration && config.ai.geminiApiKey === "demo-key") {
    console.warn(
      "⚠️  Warning: Using demo AI key. Set GEMINI_API_KEY for real AI generation."
    );
  }

  if (
    config.features.userAuthentication &&
    config.security.jwtSecret ===
      "your-super-secret-jwt-key-change-in-production"
  ) {
    console.warn(
      "⚠️  Warning: Using default JWT secret. Change JWT_SECRET in production."
    );
  }

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`❌ Required environment variable ${envVar} is not set`);
    }
  });

  console.log("✅ Configuration validated");
}

// Initialize validation
validateConfig();

module.exports = config;
