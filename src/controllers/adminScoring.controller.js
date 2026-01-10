import { scoreQuizResponses } from "../services/adminScoring.service.js";

export async function scoreQuizController(req, res, next) {
  try {
    const { quizId } = req.params;

    const scoredCount = await scoreQuizResponses(quizId);

    res.json({
      message: "Responses scored successfully",
      scoredCount,
    });
  } catch (err) {
    if (err.message === "MATCH_NOT_COMPLETED") {
      return res.status(403).json({
        message: "Cannot score before match completion",
      });
    }

    if (err.message === "ANSWERS_NOT_SET") {
      return res.status(400).json({
        message: "Correct answers are not set for all questions",
      });
    }

    if (err.message === "QUIZ_NOT_FOUND") {
      return res.status(404).json({ message: "Quiz not found" });
    }

    next(err);
  }
}
