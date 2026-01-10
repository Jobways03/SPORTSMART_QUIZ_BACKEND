import { Match } from "../models/Match.js";
import { Quiz } from "../models/Quiz.js";
import { Question } from "../models/Question.js";

export async function setCorrectAnswers({ quizId, answers }) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");

  const match = await Match.findById(quiz.matchId);
  if (!match) throw new Error("MATCH_NOT_FOUND");

  // 🔒 Post-match only
  if (match.status !== "COMPLETED") {
    throw new Error("MATCH_NOT_COMPLETED");
  }

  const bulkOps = answers.map((a) => ({
    updateOne: {
      filter: { _id: a.questionId, quizId },
      update: {
        correctOptionIndex: a.correctOptionIndex,
        points: a.points,
      },
    },
  }));

  if (bulkOps.length === 0) {
    throw new Error("NO_ANSWERS_PROVIDED");
  }

  await Question.bulkWrite(bulkOps);

  return true;
}
