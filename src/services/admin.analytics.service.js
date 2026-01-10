import mongoose from "mongoose";
import { Match } from "../models/Match.js";
import { Quiz } from "../models/Quiz.js";
import { Question } from "../models/Question.js";
import { Response } from "../models/Response.js";
import { User } from "../models/User.js";

/* ---------------- DASHBOARD ---------------- */

export async function dashboardAnalytics() {
  const [
    totalMatches,
    totalQuizzes,
    totalUsers,
    totalResponses,
    avgScoreAgg,
    quizStats,
  ] = await Promise.all([
    Match.countDocuments(),
    Quiz.countDocuments(),
    User.countDocuments(),
    Response.countDocuments(),
    Response.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$score" } } },
    ]),
    Quiz.aggregate([
      {
        $group: {
          _id: null,
          locked: { $sum: { $cond: ["$isLocked", 1, 0] } },
          published: { $sum: { $cond: ["$isResultPublished", 1, 0] } },
        },
      },
    ]),
  ]);

  return {
    totals: {
      matches: totalMatches,
      quizzes: totalQuizzes,
      users: totalUsers,
      attempts: totalResponses,
    },
    performance: {
      averageScore: avgScoreAgg[0]?.avgScore || 0,
    },
    quizStatus: quizStats[0] || { locked: 0, published: 0 },
  };
}

/* ---------------- MATCH ---------------- */

export async function matchAnalytics(matchId) {
  const matchObjectId = new mongoose.Types.ObjectId(matchId);

  const responses = await Response.aggregate([
    { $match: { matchId: matchObjectId } },
    {
      $group: {
        _id: "$quizId",
        attempts: { $sum: 1 },
        avgScore: { $avg: "$score" },
      },
    },
  ]);

  return { matchId, quizzes: responses };
}

/* ---------------- QUIZ ---------------- */

export async function quizAnalytics(quizId) {
  const quizObjectId = new mongoose.Types.ObjectId(quizId);

  const responses = await Response.find({ quizId: quizObjectId });
  const questions = await Question.find({ quizId: quizObjectId });

  const attempts = responses.length;
  const avgScore = responses.reduce((s, r) => s + r.score, 0) / (attempts || 1);

  return {
    quizId,
    attempts,
    averageScore: avgScore,
    questions: questions.length,
  };
}

/* ---------------- ADVANCED ---------------- */

export async function timeSeriesAnalytics() {
  /* same as before */
}
export async function questionHeatmap() {
  /* same as before */
}
export async function topUsersByQuiz() {
  /* same as before */
}
export async function submissionTimingAnalytics() {
  /* same as before */
}
