import mongoose from "mongoose";

const winnerOverrideSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
      type: String, // admin _id (sub from JWT)
      required: true,
    },
  },
  { timestamps: true }
);

export const WinnerOverride = mongoose.model("WinnerOverride", winnerOverrideSchema);
