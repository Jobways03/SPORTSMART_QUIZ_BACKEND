import { Response } from "../models/Response.js";
import { Question } from "../models/Question.js";

export async function getQuizResponses(quizId) {
  const responses = await Response.find({ quizId })
    .populate("userId", "name phone")
    .sort({ submittedAt: 1 });

  const questions = await Question.find({ quizId });
  const questionMap = {};
  questions.forEach((q) => {
    questionMap[q._id.toString()] = q;
  });

  return responses.map((r) => ({
    user: {
      name: r.userId.name,
      phone: r.userId.phone,
    },
    submittedAt: r.submittedAt,
    score: r.isScored ? r.score : null,
    answers: r.answers.map((a) => {
      const q = questionMap[a.questionId.toString()];
      return {
        question: q.questionText,
        selectedOption: q.options[a.selectedOptionIndex],
        correctOption:
          q.correctOptionIndex !== null
            ? q.options[q.correctOptionIndex]
            : null,
      };
    }),
  }));
}
