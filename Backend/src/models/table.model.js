const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: Number,
      required: [true, "Table number is required"],
      unique: true,
      min: [1, "Table number must be a positive integer"],
    },
    capacity: {
      type: Number,
      required: [true, "Table capacity is required"],
      min: [1, "Capacity must be at least 1"],
      max: [20, "Capacity cannot exceed 20"],
    },
    isActive: {
      type: Boolean,
      default: true, // allows admin to "soft delete" / disable a table without losing history
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Table", tableSchema);
