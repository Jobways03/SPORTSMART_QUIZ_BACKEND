import { Quiz } from "../models/Quiz.js";
import {
  createQuestion,
  getQuestionsByQuiz,
  updateQuestion,
  deleteQuestion,
} from "../services/question.service.js";

export async function createQuestionController(req, res, next) {
  try {
    const { quizId, questionText, options, points, order } = req.body;

    if (!quizId || !questionText || !options) {
      return res
        .status(400)
        .json({ message: "quizId, questionText and options are required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const question = await createQuestion({
      quizId,
      questionText,
      options,
      points,
      order,
    });

    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
}

export async function listQuestionsByQuizController(req, res, next) {
  try {
    const questions = await getQuestionsByQuiz(req.params.quizId);
    res.json(questions);
  } catch (err) {
    next(err);
  }
}

export async function updateQuestionController(req, res, next) {
  try {
    const question = await updateQuestion(req.params.questionId, req.body);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    next(err);
  }
}

export async function deleteQuestionController(req, res, next) {
  try {
    const question = await deleteQuestion(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question deleted" });
  } catch (err) {
    next(err);
  }
}
