import { Router } from "express";
import {
  leaderboardController,
  userRankController,
  fullLeaderboardController,
} from "../controllers/leaderboard.controller.js";

const router = Router();

/**
 * USER: Leaderboard
 */
router.get("/:quizId", leaderboardController);
router.get("/:quizId/rank/:userId", userRankController);
router.get("/:quizId/full/:userId", fullLeaderboardController);

export default router;
