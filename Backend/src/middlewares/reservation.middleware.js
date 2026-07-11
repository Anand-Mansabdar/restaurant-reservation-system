const { body, param } = require("express-validator");
const Reservation = require("../models/reservation.model");

const reservationValidation = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date (YYYY-MM-DD)"),

  body("timeSlot")
    .notEmpty()
    .withMessage("Time slot is required")
    .isIn(Reservation.TIME_SLOTS)
    .withMessage(
      `Time slot must be one of: ${Reservation.TIME_SLOTS.join(", ")}`,
    ),

  body("guests")
    .notEmpty()
    .withMessage("Number of guests is required")
    .isInt({ min: 1 })
    .withMessage("Guests must be a positive integer"),
];

const reservationIdValidation = [
  param("id").isMongoId().withMessage("Invalid reservation ID"),
];

module.exports = { reservationValidation, reservationIdValidation };
