const Table = require("../models/table.model");
const Reservation = require("../models/reservation.model");
const AppError = require("../utils/appError");
const { RESERVATION_STATUS } = require("../utils/constants");

/**
 * Creates a new table. tableNumber must be unique (enforced by the schema's
 * unique index too, but we check first for a clean error message).
 */
const createTable = async ({ tableNumber, capacity, isActive }) => {
  const existing = await Table.findOne({ tableNumber });
  if (existing) {
    throw new AppError(`Table number ${tableNumber} already exists.`, 409);
  }

  return Table.create({
    tableNumber,
    capacity,
    isActive: isActive !== undefined ? isActive : true,
  });
};

/**
 * Updates a table's details. If capacity is being reduced, we don't block it
 * (a currently-booked reservation with more guests than the new capacity is
 * an edge case the admin should be aware of, but historical reservations
 * shouldn't be invalidated retroactively) — this is called out as a known
 * limitation in the README rather than silently blocking legitimate edits.
 */
const updateTable = async (tableId, updates) => {
  const table = await Table.findById(tableId);
  if (!table) {
    throw new AppError("Table not found.", 404);
  }

  if (
    updates.tableNumber !== undefined &&
    updates.tableNumber !== table.tableNumber
  ) {
    const existing = await Table.findOne({ tableNumber: updates.tableNumber });
    if (existing) {
      throw new AppError(
        `Table number ${updates.tableNumber} already exists.`,
        409,
      );
    }
    table.tableNumber = updates.tableNumber;
  }

  if (updates.capacity !== undefined) {
    table.capacity = updates.capacity;
  }

  if (updates.isActive !== undefined) {
    table.isActive = updates.isActive;
  }

  await table.save();
  return table;
};

/**
 * Removes a table. Implemented as a SOFT delete (isActive = false) rather
 * than a hard document delete: existing reservations reference this table
 * by ObjectId, and hard-deleting it would orphan that reference and break
 * admin history views. A deactivated table simply stops being offered for
 * new bookings (see ReservationService.findCandidateTables, which filters
 * on isActive: true).
 */
const deactivateTable = async (tableId) => {
  const table = await Table.findById(tableId);
  if (!table) {
    throw new AppError("Table not found.", 404);
  }

  const activeBookings = await Reservation.countDocuments({
    table: tableId,
    status: RESERVATION_STATUS.BOOKED,
  });

  if (activeBookings > 0) {
    throw new AppError(
      `Cannot remove Table ${table.tableNumber}: it has ${activeBookings} active booking(s). Cancel or reassign them first.`,
      409,
    );
  }

  table.isActive = false;
  await table.save();
  return table;
};

const getAllTables = async () => {
  return Table.find().sort({ tableNumber: 1 });
};

module.exports = { createTable, updateTable, deactivateTable, getAllTables };
