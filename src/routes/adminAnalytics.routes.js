import { Router } from "express";
import { adminAnalyticsController } from "../controllers/adminAnalytics.controller.js";

const router = Router();

/**
 * ADMIN: Quiz analytics
 */
router.get("/quizzes/:quizId/analytics", adminAnalyticsController);

export default router;
