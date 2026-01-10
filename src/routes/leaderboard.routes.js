import { Router } from "express";
import {
  leaderboardController,
  userRankController,
} from "../controllers/leaderboard.controller.js";

const router = Router();

/**
 * USER: Leaderboard
 */
router.get("/:quizId", leaderboardController);
router.get("/:quizId/rank/:userId", userRankController);

export default router;
