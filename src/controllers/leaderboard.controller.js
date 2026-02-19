import {
  getQuizLeaderboard,
  getUserRank,
  getLeaderboardWithUserRank,
} from "../services/leaderboard.service.js";

export async function leaderboardController(req, res, next) {
  try {
    const { quizId } = req.params;

    const leaderboard = await getQuizLeaderboard({ quizId });

    res.json({ leaderboard });
  } catch (err) {
    if (err.message === "RESULTS_NOT_PUBLISHED") {
      return res.status(403).json({
        message: "Results not published yet",
      });
    }

    if (err.message === "QUIZ_NOT_FOUND") {
      return res.status(404).json({ message: "Quiz not found" });
    }

    next(err);
  }
}

export async function userRankController(req, res, next) {
  try {
    const { quizId, userId } = req.params;

    const rank = await getUserRank({ quizId, userId });

    res.json({ rank });
  } catch (err) {
    next(err);
  }
}

/**
 * Admin: All players (no limit)
 * GET /api/admin/leaderboard/:quizId
 */
export async function adminLeaderboardController(req, res, next) {
  try {
    const { quizId } = req.params;

    const leaderboard = await getQuizLeaderboard({ quizId, limit: 0, skipPublishedCheck: true });

    res.json({ leaderboard, total: leaderboard.length });
  } catch (err) {
    if (err.message === "RESULTS_NOT_PUBLISHED") {
      return res.status(403).json({ message: "Results not published yet" });
    }
    if (err.message === "QUIZ_NOT_FOUND") {
      return res.status(404).json({ message: "Quiz not found" });
    }
    next(err);
  }
}

/**
 * Combined: Top 10 + user rank in one call
 * GET /api/leaderboard/:quizId/full/:userId
 */
export async function fullLeaderboardController(req, res, next) {
  try {
    const { quizId, userId } = req.params;

    const data = await getLeaderboardWithUserRank({ quizId, userId });

    res.json(data);
  } catch (err) {
    if (err.message === "RESULTS_NOT_PUBLISHED") {
      return res.status(403).json({
        message: "Results not published yet",
      });
    }

    if (err.message === "QUIZ_NOT_FOUND") {
      return res.status(404).json({ message: "Quiz not found" });
    }

    next(err);
  }
}
