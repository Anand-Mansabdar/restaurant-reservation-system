const { body, param } = require("express-validator");

const createTableValidation = [
  body("tableNumber")
    .notEmpty()
    .withMessage("Table number is required")
    .isInt({ min: 1 })
    .withMessage("Table number must be a positive integer"),
  body("capacity")
    .notEmpty()
    .withMessage("Capacity is required")
    .isInt({ min: 1, max: 20 })
    .withMessage("Capacity must be between 1 and 20"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

const updateTableValidation = [
  body("tableNumber")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Table number must be a positive integer"),
  body("capacity")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Capacity must be between 1 and 20"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

const tableIdValidation = [
  param("id").isMongoId().withMessage("Invalid table ID"),
];

module.exports = {
  createTableValidation,
  updateTableValidation,
  tableIdValidation,
};
