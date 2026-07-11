const { errorResponse } = require("../utils/responseFormatter");

/**
 * Centralized error handler. Every controller/service can just `throw` or
 * call `next(err)` and this converts it into a consistent JSON response,
 * instead of duplicating try/catch response logic everywhere.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key (e.g. duplicate email, or the reservation partial unique index)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    if (field === "table" || err.keyPattern?.table) {
      message =
        "This table is already booked for the selected date and time slot.";
    } else {
      message = `Duplicate value for field: ${field || "unknown"}`;
    }
  }

  // Mongoose schema validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Log unexpected (non-operational) errors for debugging; don't leak internals to client
  if (!err.isOperational) {
    console.error("UNEXPECTED ERROR:", err);
  }

  return errorResponse(res, statusCode, message);
};

module.exports = errorHandler;
