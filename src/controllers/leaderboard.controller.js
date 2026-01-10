import {
  getQuizLeaderboard,
  getUserRank,
} from "../services/leaderboard.service.js";

export async function leaderboardController(req, res, next) {
  try {
    const { quizId } = req.params;
    // const limit = Number(req.query.limit || 10);

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
