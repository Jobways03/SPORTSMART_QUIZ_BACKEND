import { getActiveQuizByMatch } from "../services/userQuiz.service.js";

export async function getActiveQuizController(req, res, next) {
  try {
    const { matchId } = req.params;

    const quizData = await getActiveQuizByMatch(matchId);

    if (!quizData) {
      return res.status(404).json({
        message: "Quiz not found for this match",
      });
    }

    res.json(quizData);
  } catch (err) {
    next(err);
  }
}
