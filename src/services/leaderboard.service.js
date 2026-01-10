import { Quiz } from "../models/Quiz.js";
import { Response } from "../models/Response.js";
import { User } from "../models/User.js";

export async function getQuizLeaderboard({ quizId, limit = 10 }) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");

  if (!quiz.isResultPublished) {
    throw new Error("RESULTS_NOT_PUBLISHED");
  }

  const responses = await Response.find({ quizId })
    .sort({ score: -1, submittedAt: 1 })
    .limit(limit)
    .populate("userId", "name phone");

  return responses.map((r, index) => ({
    rank: index + 1,
    name: r.userId.name,
    phone: r.userId.phone,
    score: r.score,
  }));
}

export async function getUserRank({ quizId, userId }) {
  const betterCount = await Response.countDocuments({
    quizId,
    $or: [
      { score: { $gt: (await Response.findOne({ quizId, userId }))?.score } },
      {
        score: (await Response.findOne({ quizId, userId }))?.score,
        submittedAt: {
          $lt: (await Response.findOne({ quizId, userId }))?.submittedAt,
        },
      },
    ],
  });

  return betterCount + 1;
}
