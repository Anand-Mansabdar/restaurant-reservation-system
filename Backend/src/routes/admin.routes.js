const express = require("express");
const router = express.Router();

const {
  getAllReservations,
  updateReservation,
  cancelReservation,
} = require("../controllers/admin.controller");
const {
  dateQueryValidation,
  reservationIdValidation,
  updateReservationValidation,
} = require("../validators/admin.validator");
const validateRequest = require("../validators/request.validator");
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

// All admin routes require authentication AND the admin role
router.use(verifyToken, isAdmin);

router.get(
  "/reservations",
  dateQueryValidation,
  validateRequest,
  getAllReservations,
);
router.put(
  "/reservations/:id",
  reservationIdValidation,
  updateReservationValidation,
  validateRequest,
  updateReservation,
);
router.delete(
  "/reservations/:id",
  reservationIdValidation,
  validateRequest,
  cancelReservation,
);

module.exports = router;
