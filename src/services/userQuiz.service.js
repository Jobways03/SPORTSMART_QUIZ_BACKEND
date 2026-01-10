import { Match } from "../models/Match.js";
import { Quiz } from "../models/Quiz.js";
import { Question } from "../models/Question.js";

export async function getActiveQuizByMatch(matchId) {
  const match = await Match.findById(matchId);
  if (!match) return null;

  const quiz = await Quiz.findOne({ matchId });
  if (!quiz) return null;

  // AUTO-LOCK LOGIC
  const now = new Date();
  if (!quiz.isLocked && now >= match.startTime) {
    quiz.isLocked = true;
    await quiz.save();
  }

  const questions = await Question.find({ quizId: quiz._id })
    .sort({ order: 1 })
    .select("_id questionText options order");

  return {
    quizId: quiz._id,
    isLocked: quiz.isLocked,
    match: {
      id: match._id,
      title: match.title,
      startTime: match.startTime,
      status: match.status,
    },
    questions,
  };
}
