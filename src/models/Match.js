import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tournament: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["UPCOMING", "LIVE", "COMPLETED"],
      default: "UPCOMING",
      index: true,
    },
  },
  { timestamps: true }
);

export const Match = mongoose.model("Match", matchSchema);
