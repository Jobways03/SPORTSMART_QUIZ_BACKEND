import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "SUPER_ADMIN"],
      default: "ADMIN",
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", adminSchema);
