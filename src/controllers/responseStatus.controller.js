import { hasUserSubmittedQuiz } from "../services/responseStatus.service.js";

export async function responseStatusController(req, res, next) {
  try {
    const { quizId, userId } = req.query;

    if (!quizId || !userId) {
      return res.status(400).json({
        message: "quizId and userId are required",
      });
    }

    const submitted = await hasUserSubmittedQuiz({ quizId, userId });

    res.json({ submitted });
  } catch (err) {
    next(err);
  }
}
