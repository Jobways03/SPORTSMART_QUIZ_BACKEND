import { setCorrectAnswers } from "../services/adminAnswer.service.js";

export async function setCorrectAnswersController(req, res, next) {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        message: "answers array is required",
      });
    }

    await setCorrectAnswers({ quizId, answers });

    res.json({ message: "Correct answers saved successfully" });
  } catch (err) {
    if (err.message === "MATCH_NOT_COMPLETED") {
      return res.status(403).json({
        message: "Cannot set answers before match completion",
      });
    }

    if (err.message === "QUIZ_NOT_FOUND") {
      return res.status(404).json({ message: "Quiz not found" });
    }

    next(err);
  }
}
