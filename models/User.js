import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    penalty: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

export const User = models.User || mongoose.model("User", userSchema);