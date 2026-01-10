import { Router } from "express";
import { getActiveQuizController } from "../controllers/userQuiz.controller.js";

const router = Router();

/**
 * USER Quiz API
 */
router.get("/active/:matchId", getActiveQuizController);

export default router;
