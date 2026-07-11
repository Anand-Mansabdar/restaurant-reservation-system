const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/responseFormatter");
const ReservationService = require("../services/reservation.service");

/**
 * @route   GET /api/admin/reservations
 * @route   GET /api/admin/reservations?date=YYYY-MM-DD
 * @access  Private (Admin)
 */
const getAllReservations = asyncHandler(async (req, res) => {
  const { date } = req.query;

  const reservations = await ReservationService.getAllReservations(date);

  return successResponse(res, 200, "Reservations fetched successfully", {
    reservations,
  });
});

/**
 * @route   PUT /api/admin/reservations/:id
 * @access  Private (Admin)
 * Allows the admin to change any field on any reservation: date, timeSlot,
 * guests, table (manual reassignment), or status.
 */
const updateReservation = asyncHandler(async (req, res) => {
  const reservation = await ReservationService.adminUpdateReservation(
    req.params.id,
    req.body,
  );

  return successResponse(res, 200, "Reservation updated successfully", {
    reservation,
  });
});

/**
 * @route   DELETE /api/admin/reservations/:id
 * @access  Private (Admin)
 * Same soft-delete pattern as the customer-facing cancellation, but without
 * an ownership check — admin can cancel any reservation.
 */
const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await ReservationService.adminCancelReservation(
    req.params.id,
  );

  return successResponse(res, 200, "Reservation cancelled successfully", {
    reservation,
  });
});

module.exports = { getAllReservations, updateReservation, cancelReservation };
