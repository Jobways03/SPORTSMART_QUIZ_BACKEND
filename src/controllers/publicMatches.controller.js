// controllers/publicMatches.controller.js
import { Match } from "../models/Match.js";
import { getMatchesForUser } from "../services/match.service.js";

export async function getPublicMatches(req, res, next) {
  try {
    const matches = await Match.find()
      .select("_id title startTime status tournament")
      .sort({ startTime: 1 });
    res.json(matches);
  } catch (err) {
    next(err);
  }
}

export async function getUserMatchesController(req, res, next) {
  try {
    const userId = req.headers["x-user-id"];

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const matches = await getMatchesForUser(userId);
    res.json(matches);
  } catch (err) {
    next(err);
  }
}
