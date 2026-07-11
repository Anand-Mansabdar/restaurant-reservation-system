const Table = require("../models/table.model");
const Reservation = require("../models/reservation.model");
const AppError = require("../utils/appError");
const { normalizeDate, isTodayOrFuture } = require("../utils/dateUtils.js");
const { RESERVATION_STATUS } = require("../utils/constants");

/**
 * Finds all active tables whose capacity can seat the given number of guests,
 * sorted smallest-capacity-first (so a party of 3 gets a 4-seat table, not a
 * 6-seat table, if both are free).
 */
const findCandidateTables = async (guests) => {
  return Table.find({
    isActive: true,
    capacity: { $gte: guests },
  }).sort({ capacity: 1 });
};

/**
 * Returns the set of table IDs already booked for a given date + timeSlot.
 */
const getBookedTableIds = async (date, timeSlot) => {
  const bookedReservations = await Reservation.find({
    date,
    timeSlot,
    status: RESERVATION_STATUS.BOOKED,
  }).select("table");

  return new Set(bookedReservations.map((r) => r.table.toString()));
};

/**
 * Creates a reservation for a customer, automatically assigning the
 * smallest available table that fits the party size.
 *
 * Steps (mirrors the assignment's required flow):
 *   1. Validate & normalize the date
 *   2. Find tables with capacity >= guests, smallest first
 *   3. Exclude tables already booked for that date + timeSlot
 *   4. Attempt to book the first available candidate
 *      (retries on the next candidate if a race condition is detected)
 *   5. If nothing works, throw a meaningful error
 */
const createReservation = async (customerId, { date, timeSlot, guests }) => {
  const normalizedDate = normalizeDate(date);

  if (!normalizedDate) {
    throw new AppError("Invalid date provided.", 400);
  }

  if (!isTodayOrFuture(normalizedDate)) {
    throw new AppError("Cannot make a reservation for a past date.", 400);
  }

  // 1. Find every table big enough for the party, smallest first
  const candidateTables = await findCandidateTables(guests);

  if (candidateTables.length === 0) {
    throw new AppError(
      `No table with capacity for ${guests} guest(s) exists in the restaurant.`,
      404,
    );
  }

  // 2. Exclude tables already booked for this date + slot
  const bookedTableIds = await getBookedTableIds(normalizedDate, timeSlot);
  const availableTables = candidateTables.filter(
    (table) => !bookedTableIds.has(table._id.toString()),
  );

  if (availableTables.length === 0) {
    throw new AppError(
      "No tables are available for the selected date and time slot. Please try a different time.",
      409,
    );
  }

  // 3. Attempt to book, smallest suitable table first. Loop guards against a
  // race condition where another request books the same table between our
  // read (step 2) and this write — the DB's partial unique index will reject
  // a duplicate, and we simply fall through to the next candidate.
  for (const table of availableTables) {
    try {
      const reservation = await Reservation.create({
        customer: customerId,
        table: table._id,
        date: normalizedDate,
        timeSlot,
        guests,
        status: RESERVATION_STATUS.BOOKED,
      });

      return reservation.populate([
        { path: "table", select: "tableNumber capacity" },
        { path: "customer", select: "name email" },
      ]);
    } catch (err) {
      if (err.code === 11000) {
        // This specific table was just taken by a concurrent request — try the next one
        continue;
      }
      throw err;
    }
  }

  // Every candidate lost the race to a concurrent booking
  throw new AppError(
    "All suitable tables were just booked by another customer. Please try again.",
    409,
  );
};

/**
 * Returns all reservations belonging to a specific customer, most recent first.
 */
const getCustomerReservations = async (customerId) => {
  return Reservation.find({ customer: customerId })
    .populate("table", "tableNumber capacity")
    .sort({ date: -1, createdAt: -1 });
};

/**
 * Cancels a reservation, but only if it belongs to the requesting customer
 * and is still in 'Booked' status (can't cancel something already cancelled
 * or completed).
 */
const cancelCustomerReservation = async (reservationId, customerId) => {
  const reservation = await Reservation.findById(reservationId);

  if (!reservation) {
    throw new AppError("Reservation not found.", 404);
  }

  if (reservation.customer.toString() !== customerId.toString()) {
    throw new AppError(
      "You are not authorized to cancel this reservation.",
      403,
    );
  }

  if (reservation.status !== RESERVATION_STATUS.BOOKED) {
    throw new AppError(
      `Cannot cancel a reservation that is already ${reservation.status.toLowerCase()}.`,
      400,
    );
  }

  reservation.status = RESERVATION_STATUS.CANCELLED;
  await reservation.save();

  return reservation;
};

module.exports = {
  findCandidateTables,
  getBookedTableIds,
  createReservation,
  getCustomerReservations,
  cancelCustomerReservation,
};
