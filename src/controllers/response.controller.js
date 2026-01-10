import { submitQuizResponse } from "../services/response.service.js";

export async function submitResponseController(req, res, next) {
  try {
    const { quizId, matchId, userId, answers } = req.body;

    if (!quizId || !matchId || !userId || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "quizId, matchId, userId and answers are required",
      });
    }

    if (answers.length === 0) {
      return res.status(400).json({ message: "Answers cannot be empty" });
    }

    await submitQuizResponse({
      quizId,
      matchId,
      userId,
      answers,
    });

    res.status(201).json({
      message: "Responses recorded successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "You have already submitted this quiz",
      });
    }

    if (err.message === "QUIZ_LOCKED") {
      return res.status(403).json({
        message: "Quiz is locked. Submissions are closed.",
      });
    }

    if (err.message === "MATCH_NOT_FOUND") {
      return res.status(404).json({ message: "Match not found" });
    }

    if (err.message === "QUIZ_NOT_FOUND") {
      return res.status(404).json({ message: "Quiz not found" });
    }

    next(err);
  }
}
