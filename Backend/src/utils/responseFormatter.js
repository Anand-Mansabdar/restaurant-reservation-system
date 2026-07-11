/**
 * Standardized success response.
 * Keeps every endpoint's response shape consistent for the frontend.
 */
const successResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standardized error response.
 * `errors` is optional — used for express-validator field-level error arrays.
 */
const errorResponse = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = { successResponse, errorResponse };
