import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 2,
        message: "At least 2 options are required",
      },
    },
    correctOptionIndex: {
      type: Number,
      default: null, // set ONLY after match
    },
    points: {
      type: Number,
      default: 5,
      min: 0,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);
