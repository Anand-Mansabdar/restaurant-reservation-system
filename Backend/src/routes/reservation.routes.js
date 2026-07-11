const express = require("express");
const router = express.Router();

const {
  createReservation,
  getMyReservations,
  cancelMyReservation,
} = require("../controllers/reservation.controller");
const {
  reservationValidation,
  reservationIdValidation,
} = require("../middlewares/reservation.middleware");
const validateRequest = require("../validators/request.validator");
const { verifyToken, isCustomer } = require("../middlewares/auth.middleware");

// All reservation routes require authentication as a customer
router.use(verifyToken, isCustomer);

router.post("/", reservationValidation, validateRequest, createReservation);
router.get("/my", getMyReservations);

// DELETE performs a soft-delete: the reservation's status is set to 'Cancelled'
// rather than the document being removed from the database. This preserves
// history for admin visibility/auditing while still freeing up the table for
// future bookings (see ReservationService.cancelCustomerReservation).
router.delete(
  "/:id",
  reservationIdValidation,
  validateRequest,
  cancelMyReservation,
);

module.exports = router;
