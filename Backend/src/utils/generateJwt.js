const jwt = require("jsonwebtoken");
const { COOKIE_NAME, JWT_EXPIRES_IN, COOKIE_MAX_AGE } = require("./constants");

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const sendTokenCookie = (res, userId, role) => {
  const token = generateToken(userId, role);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: COOKIE_MAX_AGE,
  });

  return token;
};

module.exports = { generateToken, sendTokenCookie };
