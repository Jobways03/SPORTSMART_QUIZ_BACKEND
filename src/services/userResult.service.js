import mongoose from "mongoose";
import { Quiz } from "../models/Quiz.js";
import { Response } from "../models/Response.js";
import { Question } from "../models/Question.js";

export async function getUserQuizResult({ quizId, userId }) {
  // 1️⃣ Quiz exists check
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new Error("QUIZ_NOT_FOUND");
  }

  // 2️⃣ Results published check (STRICT)
  if (quiz.isResultPublished !== true) {
    throw new Error("RESULTS_NOT_PUBLISHED");
  }

  // 3️⃣ User response check (ObjectId safe)
  const response = await Response.findOne({
    quizId: new mongoose.Types.ObjectId(quizId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!response) {
    throw new Error("RESPONSE_NOT_FOUND");
  }

  // 4️⃣ Fetch questions
  const questions = await Question.find({ quizId });

  const questionMap = {};
  for (const q of questions) {
    questionMap[q._id.toString()] = q;
  }

  // 5️⃣ Build breakdown safely
  const breakdown = response.answers
    .map((ans) => {
      const q = questionMap[ans.questionId.toString()];
      if (!q) return null;

      return {
        questionText: q.questionText,
        yourAnswer: q.options[ans.selectedOptionIndex],
        correctAnswer: q.options[q.correctOptionIndex],
        pointsEarned:
          ans.selectedOptionIndex === q.correctOptionIndex ? q.points : 0,
      };
    })
    .filter(Boolean);

  return {
    score: response.score,
    breakdown,
  };
}
