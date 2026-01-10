import { Match } from "../models/Match.js";
import mongoose from "mongoose";
import { Response } from "../models/Response.js";

export async function createMatch(data) {
  return Match.create(data);
}



export async function getMatchesForUser(userId) {
  // 1️⃣ Get matchIds where user participated
  const participatedMatches = await Response.distinct("matchId", {
    userId: new mongoose.Types.ObjectId(userId),
  });

  // 2️⃣ Build final filter
  return Match.find({
    $or: [
      { status: { $in: ["UPCOMING", "LIVE"] } },
      {
        status: "COMPLETED",
        _id: { $in: participatedMatches },
      },
    ],
  }).sort({ startTime: -1 });
}

export async function getAllMatches(filters = {}) {
  return Match.aggregate([
    { $match: filters },

    {
      $lookup: {
        from: "quizzes", // Mongo collection name
        localField: "_id",
        foreignField: "matchId",
        as: "quiz",
      },
    },

    {
      $unwind: {
        path: "$quiz",
        preserveNullAndEmptyArrays: true, // matches without quiz
      },
    },

    {
      $addFields: {
        quizId: "$quiz._id",
        isResultPublished: "$quiz.isResultPublished",
      },
    },

    {
      $project: {
        quiz: 0, // remove full quiz object
      },
    },

    { $sort: { startTime: -1 } },
  ]);
}



export async function getMatchById(matchId) {
  return Match.findById(matchId);
}

export async function updateMatch(matchId, updateData) {
  return Match.findByIdAndUpdate(matchId, updateData, { new: true });
}

export async function deleteMatch(matchId) {
  return Match.findByIdAndDelete(matchId);
}
