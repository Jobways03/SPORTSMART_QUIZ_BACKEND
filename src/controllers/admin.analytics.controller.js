import {
  dashboardAnalytics,
  matchAnalytics,
  quizAnalytics,
  timeSeriesAnalytics,
  questionHeatmap,
  topUsersByQuiz,
  submissionTimingAnalytics,
} from "../services/admin.analytics.service.js";

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    res.json(await dashboardAnalytics());
  } catch (err) {
    next(err);
  }
};

export const getMatchAnalytics = async (req, res, next) => {
  try {
    res.json(await matchAnalytics(req.params.matchId));
  } catch (err) {
    next(err);
  }
};

export const getQuizAnalytics = async (req, res, next) => {
  try {
    res.json(await quizAnalytics(req.params.quizId));
  } catch (err) {
    next(err);
  }
};

export const getTimeSeriesAnalytics = async (req, res, next) => {
  try {
    res.json(await timeSeriesAnalytics());
  } catch (err) {
    next(err);
  }
};

export const getQuestionHeatmap = async (req, res, next) => {
  try {
    res.json(await questionHeatmap(req.params.quizId));
  } catch (err) {
    next(err);
  }
};

export const getTopUsersByQuiz = async (req, res, next) => {
  try {
    res.json(
      await topUsersByQuiz(req.params.quizId, Number(req.query.limit) || 10)
    );
  } catch (err) {
    next(err);
  }
};

export const getSubmissionTimingAnalytics = async (req, res, next) => {
  try {
    res.json(await submissionTimingAnalytics(req.params.quizId));
  } catch (err) {
    next(err);
  }
};
