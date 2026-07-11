const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/auth.routes");
const reservationRoutes = require("./src/routes/reservation.routes");
const adminRoutes = require("./src/routes/admin.routes");
const tableRoutes = require("./src/routes/table.routes");
const errorHandler = require("./src/middlewares/error.middleware");
const AppError = require("./src/utils/appError");

const app = express();

// --- Core middleware ---
app.use(helmet());
// CORS configuration - allow specific origin for credentials or all origins for direct browser access
const corsOptions =
  process.env.NODE_ENV === "production"
    ? {
        origin: "https://restaurant-reservation-system-gilt.vercel.app",
        credentials: true, // required so the browser sends/receives the httpOnly cookie
      }
    : {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true, // required so the browser sends/receives the httpOnly cookie
      };

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// --- Health check ---
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// --- Routes ---
app.use("/auth", authRoutes);
app.use("/reservations", reservationRoutes);
app.use("/admin", adminRoutes);
app.use("/tables", tableRoutes);

// --- 404 handler for unmatched routes ---
app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// --- Centralized error handler (must be last) ---
app.use(errorHandler);

module.exports = app;
