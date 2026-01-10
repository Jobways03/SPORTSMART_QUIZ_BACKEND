import { publishQuizResults } from "../services/adminPublish.service.js";

export async function publishResultsController(req, res, next) {
  try {
    const { quizId } = req.params;

    await publishQuizResults(quizId);

    res.json({
      message: "Results published successfully",
    });
  } catch (err) {
    if (err.message === "ALREADY_PUBLISHED") {
      return res.status(400).json({
        message: "Results already published",
      });
    }

    if (err.message === "RESPONSES_NOT_SCORED") {
      return res.status(400).json({
        message: "Score all responses before publishing results",
      });
    }

    if (err.message === "MATCH_NOT_COMPLETED") {
      return res.status(403).json({
        message: "Cannot publish results before match completion",
      });
    }

    if (err.message === "QUIZ_NOT_FOUND") {
      return res.status(404).json({ message: "Quiz not found" });
    }

    next(err);
  }
}
