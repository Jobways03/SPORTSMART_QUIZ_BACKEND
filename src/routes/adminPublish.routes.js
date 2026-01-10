import { Router } from "express";
import { publishResultsController } from "../controllers/adminPublish.controller.js";

const router = Router();

/**
 * ADMIN: Publish quiz results
 */
router.post("/quizzes/:quizId/publish", publishResultsController);

export default router;
