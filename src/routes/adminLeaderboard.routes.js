import { Router } from "express";
import { adminLeaderboardController } from "../controllers/leaderboard.controller.js";

const router = Router();

router.get("/:quizId", adminLeaderboardController);

export default router;
