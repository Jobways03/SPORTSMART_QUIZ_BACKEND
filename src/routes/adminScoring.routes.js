import { Router } from "express";
import { scoreQuizController } from "../controllers/adminScoring.controller.js";

const router = Router();

/**
 * ADMIN: Score all responses for a quiz
 */
router.post("/quizzes/:quizId/score", scoreQuizController);

export default router;
