const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/responseFormatter");
const TableService = require("../services/table.service");

/**
 * @route   GET /api/tables
 * @access  Private (Admin)
 * Bonus endpoint (not explicitly required) so the admin UI has something to
 * list/edit against when building the "manage tables" screen.
 */
const getAllTables = asyncHandler(async (req, res) => {
  const tables = await TableService.getAllTables();
  return successResponse(res, 200, "Tables fetched successfully", { tables });
});

/**
 * @route   POST /api/tables
 * @access  Private (Admin)
 */
const createTable = asyncHandler(async (req, res) => {
  const { tableNumber, capacity, isActive } = req.body;

  const table = await TableService.createTable({
    tableNumber,
    capacity,
    isActive,
  });

  return successResponse(res, 201, "Table created successfully", { table });
});

/**
 * @route   PUT /api/tables/:id
 * @access  Private (Admin)
 */
const updateTable = asyncHandler(async (req, res) => {
  const table = await TableService.updateTable(req.params.id, req.body);

  return successResponse(res, 200, "Table updated successfully", { table });
});

/**
 * @route   DELETE /api/tables/:id
 * @access  Private (Admin)
 * Soft-deletes (deactivates) the table — see TableService.deactivateTable
 * for why this isn't a hard delete.
 */
const deleteTable = asyncHandler(async (req, res) => {
  const table = await TableService.deactivateTable(req.params.id);

  return successResponse(res, 200, "Table removed successfully", { table });
});

module.exports = { getAllTables, createTable, updateTable, deleteTable };
