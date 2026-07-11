const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/responseFormatter");
const ReservationService = require("../services/reservation.service");

/**
 * @route   POST /api/reservations
 * @access  Private (Customer)
 * Creates a reservation. Table assignment is automatic — the customer only
 * provides date, timeSlot, and guests; the service picks the smallest
 * suitable available table.
 */
const createReservation = asyncHandler(async (req, res) => {
  const { date, timeSlot, guests } = req.body;

  const reservation = await ReservationService.createReservation(req.user._id, {
    date,
    timeSlot,
    guests,
  });

  return successResponse(res, 201, "Reservation created successfully", {
    reservation,
  });
});

/**
 * @route   GET /api/reservations/my
 * @access  Private (Customer)
 */
const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await ReservationService.getCustomerReservations(
    req.user._id,
  );

  return successResponse(res, 200, "Reservations fetched successfully", {
    reservations,
  });
});

/**
 * @route   PATCH /api/reservations/:id/cancel
 * @access  Private (Customer — own reservations only)
 */
const cancelMyReservation = asyncHandler(async (req, res) => {
  const reservation = await ReservationService.cancelCustomerReservation(
    req.params.id,
    req.user._id,
  );

  return successResponse(res, 200, "Reservation cancelled successfully", {
    reservation,
  });
});

module.exports = { createReservation, getMyReservations, cancelMyReservation };
