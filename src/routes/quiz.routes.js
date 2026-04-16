import { Router } from "express";
import {
  listAllQuizzesController,
  createQuizController,
  listQuizzesByMatchController,
  getQuizController,
  updateQuizController,
} from "../controllers/quiz.controller.js";

const router = Router();

/**
 * ADMIN Quiz APIs
 */
router.get("/", listAllQuizzesController);
router.post("/", createQuizController);
router.get("/match/:matchId", listQuizzesByMatchController);
router.get("/:quizId", getQuizController);
router.patch("/:quizId", updateQuizController);

export default router;
