const User = require("../models/User");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/responseFormatter");
const { sendTokenCookie } = require("../utils/generateJwt");
const { COOKIE_NAME, ROLES } = require("../utils/constants");

/**
 * @route   POST /api/auth/register
 * @access  Public
 * Registers a new user. Role defaults to 'customer' — admin accounts are
 * seeded (see seed/seedAdmin.js), not self-registrable, to prevent
 * anyone from granting themselves admin access via the public API.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  const user = await User.create({
    name,
    email,
    password,
    role: ROLES.CUSTOMER,
  });

  sendTokenCookie(res, user._id, user.role);

  return successResponse(res, 201, "Registration successful", { user });
});

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // password has select:false in the schema, so explicitly select it here
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  sendTokenCookie(res, user._id, user.role);

  return successResponse(res, 200, "Login successful", { user });
});

/**
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return successResponse(res, 200, "Logout successful");
});

/**
 * @route   GET /api/auth/me
 * @access  Private
 * Lets the frontend rehydrate auth state (e.g. on page refresh) by
 * asking "who am I" using the existing cookie, without re-sending credentials.
 */
const getMe = asyncHandler(async (req, res) => {
  return successResponse(res, 200, "Current user fetched", { user: req.user });
});

module.exports = { register, login, logout, getMe };
