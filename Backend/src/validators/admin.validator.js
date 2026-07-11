const { body, param, query } = require("express-validator");
const Reservation = require("../models/reservation.model");

const dateQueryValidation = [
  query("date")
    .optional()
    .isISO8601()
    .withMessage("date query param must be a valid date (YYYY-MM-DD)"),
];

const reservationIdValidation = [
  param("id").isMongoId().withMessage("Invalid reservation ID"),
];

// All fields optional since this is a PUT for partial/full updates by admin
const updateReservationValidation = [
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date (YYYY-MM-DD)"),
  body("timeSlot")
    .optional()
    .isIn(Reservation.TIME_SLOTS)
    .withMessage(
      `Time slot must be one of: ${Reservation.TIME_SLOTS.join(", ")}`,
    ),
  body("guests")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Guests must be a positive integer"),
  body("table").optional().isMongoId().withMessage("Invalid table ID"),
  body("status")
    .optional()
    .isIn(["Booked", "Cancelled", "Completed"])
    .withMessage("Status must be Booked, Cancelled, or Completed"),
];

module.exports = {
  dateQueryValidation,
  reservationIdValidation,
  updateReservationValidation,
};
