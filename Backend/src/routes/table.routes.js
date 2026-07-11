const express = require("express");
const router = express.Router();

const {
  getAllTables,
  createTable,
  updateTable,
  deleteTable,
} = require("../controllers/table.controller");
const {
  createTableValidation,
  updateTableValidation,
  tableIdValidation,
} = require("../validators/table.validator");
const validateRequest = require("../validators/request.validator");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

// All table management routes require authentication AND the admin role
router.use(verifyToken, isAdmin);

router.get("/", getAllTables);
router.post("/", createTableValidation, validateRequest, createTable);
router.put(
  "/:id",
  tableIdValidation,
  updateTableValidation,
  validateRequest,
  updateTable,
);
router.delete("/:id", tableIdValidation, validateRequest, deleteTable);

module.exports = router;
