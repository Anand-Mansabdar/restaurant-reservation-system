/**
 * Custom operational error class.
 * Lets controllers/services do `throw new AppError('message', 404)`
 * and have the centralized error handler respond correctly, instead
 * of every layer having to know about res.status().json() shape.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // distinguishes expected errors from programming bugs

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
