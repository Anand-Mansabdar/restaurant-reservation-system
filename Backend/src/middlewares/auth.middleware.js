const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/appError");
const { COOKIE_NAME, ROLES } = require("../utils/constants");

/**
 * Verifies the JWT from the httpOnly cookie (falls back to Authorization
 * header for API testing tools like Postman/Thunder Client), attaches the
 * authenticated user to req.user, and calls next().
 */
const verifyToken = async (req, res, next) => {
  try {
    let token = req.cookies?.[COOKIE_NAME];

    // Fallback: allow Bearer token too, so the API is easy to test outside a browser
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new AppError("Not authenticated. Please log in.", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Re-fetch the user so role/existence is always current (e.g. account deleted)
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError("User belonging to this token no longer exists.", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token. Please log in again.", 401));
    }
    if (err.name === "TokenExpiredError") {
      return next(new AppError("Session expired. Please log in again.", 401));
    }
    next(err);
  }
};

/**
 * Restricts access to admins only. Must run after verifyToken.
 */
const isAdmin = (req, res, next) => {
  if (req.user?.role !== ROLES.ADMIN) {
    return next(new AppError("Access denied. Admins only.", 403));
  }
  next();
};

/**
 * Restricts access to customers only. Must run after verifyToken.
 * (Included for completeness — e.g. an admin shouldn't be creating reservations
 * as themselves through the customer flow.)
 */
const isCustomer = (req, res, next) => {
  if (req.user?.role !== ROLES.CUSTOMER) {
    return next(new AppError("Access denied. Customers only.", 403));
  }
  next();
};

module.exports = { verifyToken, isAdmin, isCustomer };
