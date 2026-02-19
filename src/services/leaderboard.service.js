import { Quiz } from "../models/Quiz.js";
import { Response } from "../models/Response.js";

export async function getQuizLeaderboard({ quizId, limit = 10, skipPublishedCheck = false }) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");

  if (!skipPublishedCheck && !quiz.isResultPublished) {
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
  const userResponse = await Response.findOne({ quizId, userId });
  if (!userResponse) return null;

  const betterCount = await Response.countDocuments({
    quizId,
    $or: [
      { score: { $gt: userResponse.score } },
      {
        score: userResponse.score,
        submittedAt: { $lt: userResponse.submittedAt },
      },
    ],
  });

  return betterCount + 1;
}

/**
 * Combined: Top 10 + current user's rank & score
 */
export async function getLeaderboardWithUserRank({ quizId, userId }) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");

  if (!quiz.isResultPublished) {
    throw new Error("RESULTS_NOT_PUBLISHED");
  }

  // Top 10
  const top10Responses = await Response.find({ quizId })
    .sort({ score: -1, submittedAt: 1 })
    .limit(10)
    .populate("userId", "name phone email");

  const leaderboard = top10Responses.map((r, index) => ({
    rank: index + 1,
    userId: r.userId._id,
    name: r.userId.name,
    phone: r.userId.phone,
    score: r.score,
  }));

  // Current user's rank & score
  let myEntry = null;

  if (userId) {
    const userResponse = await Response.findOne({ quizId, userId })
      .populate("userId", "name phone email");

    if (userResponse) {
      const betterCount = await Response.countDocuments({
        quizId,
        $or: [
          { score: { $gt: userResponse.score } },
          {
            score: userResponse.score,
            submittedAt: { $lt: userResponse.submittedAt },
          },
        ],
      });

      const rank = betterCount + 1;

      myEntry = {
        rank,
        userId: userResponse.userId._id,
        name: userResponse.userId.name,
        phone: userResponse.userId.phone,
        score: userResponse.score,
      };
    }
  }

  const totalPlayers = await Response.countDocuments({ quizId });

  return { leaderboard, myEntry, totalPlayers };
}
