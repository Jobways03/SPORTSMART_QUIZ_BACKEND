import { ApiError } from "../utils/ApiError.js";

export function errorMiddleware(err, req, res, next) {
  console.error("❌ Error:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  // Mongo duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate entry",
      code: "DUPLICATE_KEY",
    });
  }

  // Default
  res.status(500).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}
