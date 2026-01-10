import { Match } from "../models/Match.js";
import {
  createQuiz,
  getQuizzesByMatch,
  getQuizById,
  updateQuiz,
} from "../services/quiz.service.js";

export async function createQuizController(req, res, next) {
  try {
    const { matchId, title, description } = req.body;

    if (!matchId || !title) {
      return res
        .status(400)
        .json({ message: "matchId and title are required" });
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const quiz = await createQuiz({
      matchId,
      title,
      description,
    });

    res.status(201).json(quiz);
  } catch (err) {
    next(err);
  }
}

export async function listQuizzesByMatchController(req, res, next) {
  try {
    const { matchId } = req.params;
    const quizzes = await getQuizzesByMatch(matchId);
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
}

export async function getQuizController(req, res, next) {
  try {
    const quiz = await getQuizById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    next(err);
  }
}

export async function updateQuizController(req, res, next) {
  try {
    const quiz = await updateQuiz(req.params.quizId, req.body);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    next(err);
  }
}
