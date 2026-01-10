import { Match } from "../models/Match.js";
import { Quiz } from "../models/Quiz.js";
import { Response } from "../models/Response.js";

export async function submitQuizResponse({ quizId, matchId, userId, answers }) {
  const match = await Match.findById(matchId);
  if (!match) {
    throw new Error("MATCH_NOT_FOUND");
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new Error("QUIZ_NOT_FOUND");
  }

  const now = new Date();

  // 🔒 Time-based lock
  if (quiz.isLocked || now >= match.startTime) {
    throw new Error("QUIZ_LOCKED");
  }

  return Response.create({
    quizId,
    matchId,
    userId,
    answers,
  });
}
