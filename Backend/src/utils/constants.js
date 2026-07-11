module.exports = {
  ROLES: {
    CUSTOMER: "customer",
    ADMIN: "admin",
  },
  RESERVATION_STATUS: {
    BOOKED: "Booked",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
  },
  COOKIE_NAME: "token",
  JWT_EXPIRES_IN: "7d",
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};
