import { Router } from "express";
import {
  createQuestionController,
  listQuestionsByQuizController,
  updateQuestionController,
  deleteQuestionController,
} from "../controllers/question.controller.js";

const router = Router();

/**
 * ADMIN Question APIs
 */
router.post("/", createQuestionController);
router.get("/quiz/:quizId", listQuestionsByQuizController);
router.patch("/:questionId", updateQuestionController);
router.delete("/:questionId", deleteQuestionController);

export default router;
