const express = require("express");
const router = express.Router();

const {
  createReservation,
  getMyReservations,
  cancelMyReservation,
} = require("../controllers/reservation.controllers");
const {
  reservationValidation,
  reservationIdValidation,
} = require("../middlewares/reservation.middleware");
const { verifyToken, isCustomer } = require("../middlewares/auth.middleware");
const validateRequest = require("../validators/request.validator");

// All reservation routes require authentication as a customer
router.use(verifyToken, isCustomer);

router.post("/", reservationValidation, validateRequest, createReservation);
router.get("/my", getMyReservations);
router.patch(
  "/:id/cancel",
  reservationIdValidation,
  cancelMyReservation,
);

module.exports = router;
