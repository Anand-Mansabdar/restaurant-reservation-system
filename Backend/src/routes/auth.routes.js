const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/auth.controller");
const {
  registerValidation,
  loginValidation,
} = require("../validators/auth.validator");
const validateRequest = require("../validators/request.validator");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);
router.post("/logout", verifyToken, logout);
router.get("/me", verifyToken, getMe);

module.exports = router;
