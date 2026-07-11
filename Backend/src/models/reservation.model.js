const mongoose = require("mongoose");

const TIME_SLOTS = [
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "18:00-19:00",
  "19:00-20:00",
  "20:00-21:00",
  "21:00-22:00",
];

const reservationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer is required"],
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: [true, "Table is required"],
    },
    date: {
      type: Date,
      required: [true, "Reservation date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      enum: {
        values: TIME_SLOTS,
        message: "Invalid time slot selected",
      },
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "Guests must be at least 1"],
    },
    status: {
      type: String,
      enum: {
        values: ["Booked", "Cancelled", "Completed"],
        message: "Invalid reservation status",
      },
      default: "Booked",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

reservationSchema.index(
  { table: 1, date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "Booked" },
  },
);

reservationSchema.index({ date: 1 });

reservationSchema.index({ customer: 1 });

reservationSchema.statics.TIME_SLOTS = TIME_SLOTS;

module.exports = mongoose.model("Reservation", reservationSchema);
