import mongoose from "mongoose";

const responseSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedOptionIndex: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    score: {
      type: Number,
      default: 0,
    },
    isScored: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * 🔒 One attempt per quiz per user
 */
responseSchema.index({ quizId: 1, userId: 1 }, { unique: true });

export const Response = mongoose.model("Response", responseSchema);
