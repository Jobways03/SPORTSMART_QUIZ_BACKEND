import { Response } from "../models/Response.js";
import { Question } from "../models/Question.js";

export async function getQuizAnalytics(quizId) {
  const responses = await Response.find({ quizId, isScored: true });

  const totalParticipants = responses.length;

  const scores = responses.map((r) => r.score);
  const totalScore = scores.reduce((a, b) => a + b, 0);

  const averageScore =
    totalParticipants === 0 ? 0 : Math.round(totalScore / totalParticipants);

  const highestScore = totalParticipants === 0 ? 0 : Math.max(...scores);

  const questions = await Question.find({ quizId });

  const questionStats = questions.map((q) => {
    let correctCount = 0;

    responses.forEach((r) => {
      const ans = r.answers.find(
        (a) => a.questionId.toString() === q._id.toString()
      );

      if (ans && ans.selectedOptionIndex === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const percentage =
      totalParticipants === 0
        ? 0
        : Math.round((correctCount / totalParticipants) * 100);

    return {
      question: q.questionText,
      correctPercentage: percentage,
    };
  });

  return {
    totalParticipants,
    averageScore,
    highestScore,
    questionStats,
  };
}
