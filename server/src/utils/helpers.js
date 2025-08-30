// Response helper utilities
const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

const sendError = (
  res,
  message = "Internal Server Error",
  statusCode = 500,
  details = null
) => {
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  });
};

const sendPaginated = (res, data, pagination, message = "Success") => {
  res.json({
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  });
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format date for API responses
const formatDate = (date) => {
  return new Date(date).toISOString();
};

// Validate UUID format
const isValidId = (id) => {
  return typeof id === "string" && id.length > 0;
};

// Clean component data for storage
const cleanComponentData = (component) => {
  return {
    id: component.id || generateId(),
    type: component.type,
    props: component.props || {},
    children: component.children || [],
  };
};

// Validate component structure
const validateComponent = (component) => {
  if (!component || typeof component !== "object") {
    return false;
  }

  if (!component.type || typeof component.type !== "string") {
    return false;
  }

  if (component.props && typeof component.props !== "object") {
    return false;
  }

  if (component.children && !Array.isArray(component.children)) {
    return false;
  }

  return true;
};

// Convert snake_case to camelCase
const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
};

// Convert camelCase to snake_case
const toSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

// Deep clone object
const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(deepClone);

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

// Sanitize filename for downloads
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-z0-9._-]/gi, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "");
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  generateId,
  formatDate,
  isValidId,
  cleanComponentData,
  validateComponent,
  toCamelCase,
  toSnakeCase,
  deepClone,
  sanitizeFilename,
};
