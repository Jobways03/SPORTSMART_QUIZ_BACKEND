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
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const data = await Response.aggregate([
    { $match: { submittedAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" } },
        attempts: { $sum: 1 },
        uniqueUsers: { $addToSet: "$userId" },
        avgScore: { $avg: "$score" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const map = {};
  data.forEach((d) => { map[d._id] = d; });

  const labels = [];
  const attemptsArr = [];
  const activeUsersArr = [];
  const avgScoreArr = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const entry = map[key];
    labels.push(label);
    attemptsArr.push(entry ? entry.attempts : 0);
    activeUsersArr.push(entry ? entry.uniqueUsers.length : 0);
    avgScoreArr.push(entry ? Math.round(entry.avgScore * 10) / 10 : 0);
  }

  return {
    labels,
    datasets: { attempts: attemptsArr, activeUsers: activeUsersArr, avgScore: avgScoreArr },
  };
}

export async function questionHeatmap(quizId) {
  const quizObjectId = new mongoose.Types.ObjectId(quizId);

  const [questions, responses] = await Promise.all([
    Question.find({ quizId: quizObjectId }).sort({ order: 1 }),
    Response.find({ quizId: quizObjectId }),
  ]);

  const totalResponses = responses.length;
  if (totalResponses === 0) return [];

  return questions.map((q, i) => {
    const correctIdx = q.correctOptionIndex;
    if (correctIdx === null || correctIdx === undefined) {
      return { questionIndex: i + 1, questionText: q.questionText, correctPercentage: 0 };
    }
    const correctCount = responses.filter((r) => {
      const ans = r.answers.find((a) => String(a.questionId) === String(q._id));
      return ans && ans.selectedOptionIndex === correctIdx;
    }).length;
    return {
      questionIndex: i + 1,
      questionText: q.questionText,
      correctPercentage: Math.round((correctCount / totalResponses) * 100),
    };
  });
}

export async function topUsersByQuiz(quizId, limit = 10) {
  const quizObjectId = new mongoose.Types.ObjectId(quizId);

  const responses = await Response.find({ quizId: quizObjectId })
    .sort({ score: -1, submittedAt: 1 })
    .limit(limit)
    .populate("userId", "name");

  return responses.map((r) => ({
    userName: r.userId?.name || "Unknown",
    score: r.score,
  }));
}

export async function submissionTimingAnalytics(quizId) {
  const quizObjectId = new mongoose.Types.ObjectId(quizId);

  const quiz = await Quiz.findById(quizObjectId).populate("matchId", "startTime");
  if (!quiz) return { buckets: { early: 0, medium: 0, late: 0 } };

  const matchStartTime = quiz.matchId?.startTime;
  if (!matchStartTime) return { buckets: { early: 0, medium: 0, late: 0 } };

  const responses = await Response.find({ quizId: quizObjectId }, "submittedAt");
  const startMs = new Date(matchStartTime).getTime();
  const buckets = { early: 0, medium: 0, late: 0 };

  responses.forEach((r) => {
    const diffMinutes = (startMs - new Date(r.submittedAt).getTime()) / 60000;
    if (diffMinutes > 30) buckets.early++;
    else if (diffMinutes >= 10) buckets.medium++;
    else buckets.late++;
  });

  return { buckets };
}
