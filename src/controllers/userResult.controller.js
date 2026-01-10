import { getUserQuizResult } from "../services/userResult.service.js";

export async function userResultController(req, res, next) {
  try {
    const { quizId, userId } = req.params;

    const result = await getUserQuizResult({ quizId, userId });

    return res.json({
      published: true,
      score: result.score,
      breakdown: result.breakdown,
    });
  } catch (err) {
    // ❌ Results not published
    if (err.message === "RESULTS_NOT_PUBLISHED") {
      return res.json({
        published: false,
        message: "Results not published yet",
      });
    }

    // ❌ User did not submit
    if (err.message === "RESPONSE_NOT_FOUND") {
      return res.status(404).json({
        message: "You did not participate in this quiz",
      });
    }

    // ❌ Quiz not found
    if (err.message === "QUIZ_NOT_FOUND") {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    return next(err);
  }
}
