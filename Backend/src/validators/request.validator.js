const { validationResult } = require("express-validator");
const { errorResponse } = require("../utils/responseFormatter");

/**
 * Runs after a validator chain (e.g. registerValidation) has executed.
 * Collects any field errors and returns a single, consistent 400 response
 * instead of each controller handling validation manually.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return errorResponse(res, 400, "Validation failed", formattedErrors);
  }

  next();
};

module.exports = validateRequest;
