import { Router } from "express";
import { setCorrectAnswersController } from "../controllers/adminAnswer.controller.js";

const router = Router();

/**
 * ADMIN: Set correct answers (post-match)
 */
router.post("/quizzes/:quizId/answers", setCorrectAnswersController);

export default router;
