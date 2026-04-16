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

    coverImage: {
      type: String, // S3 / Cloudinary / CDN URL
      trim: true,
      default: null,
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

    winner: {
      name:     { type: String, trim: true, default: null },
      photo:    { type: String, trim: true, default: null },
      location: { type: String, trim: true, default: null },
      prize:    { type: String, trim: true, default: null },
    },
  },
  { timestamps: true }
);

export const Match = mongoose.model("Match", matchSchema);
