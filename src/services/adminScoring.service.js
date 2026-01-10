import { Match } from "../models/Match.js";
import { Quiz } from "../models/Quiz.js";
import { Question } from "../models/Question.js";
import { Response } from "../models/Response.js";

export async function scoreQuizResponses(quizId) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");

  const match = await Match.findById(quiz.matchId);
  if (!match) throw new Error("MATCH_NOT_FOUND");

  if (match.status !== "COMPLETED") {
    throw new Error("MATCH_NOT_COMPLETED");
  }

  const questions = await Question.find({ quizId });

  if (questions.some((q) => q.correctOptionIndex === null)) {
    throw new Error("ANSWERS_NOT_SET");
  }

  const questionMap = {};
  for (const q of questions) {
    questionMap[q._id.toString()] = q;
  }

  const responses = await Response.find({ quizId });

  let scoredCount = 0;

  for (const response of responses) {
    let totalScore = 0;

    for (const ans of response.answers) {
      const question = questionMap[ans.questionId.toString()];
      if (!question) continue;

      if (ans.selectedOptionIndex === question.correctOptionIndex) {
        totalScore += question.points;
      }
    }

    response.score = totalScore;
    response.isScored = true;
    await response.save();

    scoredCount++;
  }

  return scoredCount;
}
