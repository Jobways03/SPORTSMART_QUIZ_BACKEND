import { Quiz } from "../models/Quiz.js";
import { Response } from "../models/Response.js";
import { WinnerOverride } from "../models/WinnerOverride.js";
import { User } from "../models/User.js"; // ensure model is registered for populate

export async function getQuizLeaderboard({ quizId, limit = 10, skipPublishedCheck = false, includePhone = false }) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");

  if (!skipPublishedCheck && !quiz.isResultPublished) {
    throw new Error("RESULTS_NOT_PUBLISHED");
  }

  const userFields = includePhone ? "name phone" : "name";
  const override = await WinnerOverride.findOne({ quizId }).populate("userId", userFields);

  if (override) {
    const overrideEntry = {
      rank: 1,
      name: override.userId.name,
      ...(includePhone && { phone: override.userId.phone || null }),
      score: override.score,
    };

    const realLimit = limit > 0 ? limit - 1 : 0;
    const otherQuery = Response.find({ quizId, isOverride: { $ne: true } })
      .sort({ score: -1, submittedAt: 1 })
      .populate("userId", userFields);

    if (realLimit > 0) otherQuery.limit(realLimit);

    const others = await otherQuery;

    const otherEntries = others.map((r, index) => ({
      rank: index + 2,
      name: r.userId?.name || "Unknown User",
      ...(includePhone && { phone: r.userId?.phone || null }),
      score: r.score ?? 0,
    }));

    return [overrideEntry, ...otherEntries];
  }

  const responses = await Response.find({ quizId })
    .sort({ score: -1, submittedAt: 1 })
    .limit(limit)
    .populate("userId", userFields);

  return responses.map((r, index) => ({
    rank: index + 1,
    name: r.userId?.name || "Unknown User",
    ...(includePhone && { phone: r.userId?.phone || null }),
    score: r.score ?? 0,
  }));
}

export async function getUserRank({ quizId, userId }) {
  const userResponse = await Response.findOne({ quizId, userId });
  if (!userResponse) return null;

  const override = await WinnerOverride.findOne({ quizId });
  if (override && override.userId.toString() === userId.toString()) {
    return 1;
  }

  const overrideUserId = override ? override.userId : null;

  const betterFilter = {
    quizId,
    isOverride: { $ne: true },
    $or: [
      { score: { $gt: userResponse.score } },
      { score: userResponse.score, submittedAt: { $lt: userResponse.submittedAt } },
    ],
  };

  const betterCount = await Response.countDocuments(betterFilter);
  const overrideOffset = overrideUserId ? 1 : 0;
  return betterCount + 1 + overrideOffset;
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

  const override = await WinnerOverride.findOne({ quizId }).populate("userId", "name");

  let leaderboard = [];

  if (override) {
    const overrideEntry = {
      rank: 1,
      userId: override.userId._id,
      name: override.userId.name,
            score: override.score,
    };

    const otherResponses = await Response.find({ quizId, isOverride: { $ne: true } })
      .sort({ score: -1, submittedAt: 1 })
      .limit(9)
      .populate("userId", "name");

    const otherEntries = otherResponses.map((r, index) => ({
      rank: index + 2,
      userId: r.userId?._id,
      name: r.userId?.name || "Unknown User",
      score: r.score ?? 0,
    }));

    leaderboard = [overrideEntry, ...otherEntries];
  } else {
    const top10Responses = await Response.find({ quizId })
      .sort({ score: -1, submittedAt: 1 })
      .limit(10)
      .populate("userId", "name");

    leaderboard = top10Responses.map((r, index) => ({
      rank: index + 1,
      userId: r.userId?._id,
      name: r.userId?.name || "Unknown User",
      score: r.score ?? 0,
    }));
  }

  let myEntry = null;

  if (userId) {
    const userResponse = await Response.findOne({ quizId, userId }).populate(
      "userId",
      "name phone email"
    );

    if (userResponse && userResponse.userId) {
      let rank;

      if (override && override.userId._id.toString() === userId.toString()) {
        rank = 1;
      } else {
        const betterCount = await Response.countDocuments({
          quizId,
          isOverride: { $ne: true },
          $or: [
            { score: { $gt: userResponse.score } },
            { score: userResponse.score, submittedAt: { $lt: userResponse.submittedAt } },
          ],
        });
        rank = betterCount + 1 + (override ? 1 : 0);
      }

      myEntry = {
        rank,
        userId: userResponse.userId._id,
        name: userResponse.userId.name,
        score: userResponse.score,
      };
    }
  }

  const totalPlayers = await Response.countDocuments({ quizId });

  return { leaderboard, myEntry, totalPlayers };
}
