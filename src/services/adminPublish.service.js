import { Quiz } from "../models/Quiz.js";
import { Match } from "../models/Match.js";
import { Response } from "../models/Response.js";

export async function publishQuizResults(quizId) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");

  if (quiz.isResultPublished) {
    throw new Error("ALREADY_PUBLISHED");
  }

  const match = await Match.findById(quiz.matchId);
  if (!match) throw new Error("MATCH_NOT_FOUND");

  if (match.status !== "COMPLETED") {
    throw new Error("MATCH_NOT_COMPLETED");
  }

  const unscoredCount = await Response.countDocuments({
    quizId,
    isScored: false,
  });

  if (unscoredCount > 0) {
    throw new Error("RESPONSES_NOT_SCORED");
  }

  quiz.isResultPublished = true;
  await quiz.save();

  return true;
}
