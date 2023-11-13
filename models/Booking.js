import mongoose, { Schema, models } from "mongoose";

const bookingSchema = new Schema(
  {
    arrivalTime: {
      type: Date,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    tableName: {
      type: String,
      required: true,
    },
    tableSize: {
      type: String,
      required: true,
    },
    numberOfPeople: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "In Progress",
      enum: ["In Progress", "Completed", "Cancelled"], // Add other possible statuses as needed
    },
  },
  { timestamps: true }
);

export const Booking = models.Booking || mongoose.model("Booking", bookingSchema);
