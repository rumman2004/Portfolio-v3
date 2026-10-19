import { isProduction } from "../config/env.js";

export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  console.error("SERVER ERROR:", error);
  let statusCode = error.statusCode;
  const hasDefaultStatus = !statusCode || statusCode === 500;

  if (hasDefaultStatus && error.name === "CastError") {
    statusCode = 400;
  } else if (hasDefaultStatus && error.name === "ValidationError") {
    statusCode = 400;
  } else if (hasDefaultStatus && error.code === 11000) {
    statusCode = 409;
  } else if (hasDefaultStatus && error.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
  } else if (
    hasDefaultStatus &&
    typeof error.code === "string" &&
    error.code.startsWith("LIMIT_")
  ) {
    statusCode = 400;
  }

  if (!statusCode || statusCode < 400) {
    statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    stack: isProduction ? undefined : error.stack,
  });
};
