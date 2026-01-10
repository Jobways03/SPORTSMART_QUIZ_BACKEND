import express from "express";
import {
  getDashboardAnalytics,
  getMatchAnalytics,
  getQuizAnalytics,
  getTimeSeriesAnalytics,
  getQuestionHeatmap,
  getTopUsersByQuiz,
  getSubmissionTimingAnalytics,
} from "../controllers/admin.analytics.controller.js";

const router = express.Router();

// Core
router.get("/dashboard", getDashboardAnalytics);
router.get("/matches/:matchId", getMatchAnalytics);
router.get("/quizzes/:quizId", getQuizAnalytics);

// Advanced
router.get("/timeseries", getTimeSeriesAnalytics);
router.get("/quizzes/:quizId/heatmap", getQuestionHeatmap);
router.get("/quizzes/:quizId/top-users", getTopUsersByQuiz);
router.get("/quizzes/:quizId/submission-timing", getSubmissionTimingAnalytics);

export default router;
