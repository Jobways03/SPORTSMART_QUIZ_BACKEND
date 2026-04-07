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

  // Get ALL matches regardless of status
  const matches = await Match.find()
    .select({
      title: 1,
      tournament: 1,
      startTime: 1,
      status: 1,
      coverImage: 1,
      winner: 1,
    })
    .sort({ startTime: -1 });

  return matches.map((m) => ({
    ...m.toObject(),
    participated: participatedSet.has(m._id.toString()),
  }));
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

export async function setMatchWinner(matchId, winnerData) {
  return Match.findByIdAndUpdate(
    matchId,
    { winner: winnerData },
    { new: true }
  );
}
