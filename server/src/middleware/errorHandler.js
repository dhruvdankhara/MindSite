const config = require("../config");

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    stack: config.server.env === "development" ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Default error
  let error = {
    status: err.status || err.statusCode || 500,
    message: err.message || "Internal Server Error",
  };

  // Specific error types
  if (err.name === "ValidationError") {
    error.status = 400;
    error.message = "Validation Error";
    error.details = err.details;
  } else if (err.name === "CastError") {
    error.status = 400;
    error.message = "Invalid ID format";
  } else if (err.code === "SQLITE_CONSTRAINT") {
    error.status = 409;
    error.message = "Database constraint violation";
  } else if (err.message.includes("ENOENT")) {
    error.status = 404;
    error.message = "File not found";
  } else if (err.message.includes("EACCES")) {
    error.status = 403;
    error.message = "Permission denied";
  }

  // Don't expose internal errors in production
  if (config.server.env === "production" && error.status === 500) {
    error.message = "Internal Server Error";
  }

  res.status(error.status).json({
    error: error.message,
    ...(error.details && { details: error.details }),
    ...(config.server.env === "development" && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
