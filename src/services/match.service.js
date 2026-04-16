import { Match } from "../models/Match.js";
import mongoose from "mongoose";
import { Response } from "../models/Response.js";

export async function createMatch(data) {
  
  return Match.create(data);
}

export async function getMatchesForUser(userId) {
  // Get all matchIds where user has participated
  const participatedMatchIds = await Response.distinct("matchId", {
    userId: new mongoose.Types.ObjectId(userId),
  });

  const participatedSet = new Set(participatedMatchIds.map((id) => id.toString()));

  const matches = await Match.aggregate([
    {
      $lookup: {
        from: "quizzes",
        localField: "_id",
        foreignField: "matchId",
        as: "quiz",
      },
    },
    {
      $unwind: {
        path: "$quiz",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $addFields: {
        isResultPublished: { $ifNull: ["$quiz.isResultPublished", false] },
      },
    },
    {
      $project: {
        title: 1,
        tournament: 1,
        startTime: 1,
        status: 1,
        coverImage: 1,
        winner: 1,
        isResultPublished: 1,
      },
    },
    { $sort: { startTime: -1 } },
  ]);

  return matches.map((m) => ({
    ...m,
    participated: participatedSet.has(m._id.toString()),
  }));
}


export async function getAllMatches(filters = {}) {
  return Match.aggregate([
    { $match: filters },

    // Join quiz
    {
      $lookup: {
        from: "quizzes",
        localField: "_id",
        foreignField: "matchId",
        as: "quiz",
      },
    },
    { $unwind: { path: "$quiz", preserveNullAndEmptyArrays: true } },

    // Join winner override via quiz._id
    {
      $lookup: {
        from: "winneroverrides",
        localField: "quiz._id",
        foreignField: "quizId",
        as: "winnerOverride",
      },
    },
    { $unwind: { path: "$winnerOverride", preserveNullAndEmptyArrays: true } },

    // Join override user (name only)
    {
      $lookup: {
        from: "users",
        localField: "winnerOverride.userId",
        foreignField: "_id",
        as: "overrideUser",
      },
    },
    { $unwind: { path: "$overrideUser", preserveNullAndEmptyArrays: true } },

    {
      $addFields: {
        quizId: "$quiz._id",
        isResultPublished: "$quiz.isResultPublished",
        overrideWinnerName: "$overrideUser.name",
      },
    },

    {
      $project: {
        quiz: 0,
        winnerOverride: 0,
        overrideUser: 0,
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

export async function setMatchWinner(matchId, winnerData) {
  return Match.findByIdAndUpdate(
    matchId,
    { winner: winnerData },
    { new: true }
  );
}
