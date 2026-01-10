// controllers/publicMatches.controller.js
import { Match } from "../models/Match.js";

export async function getPublicMatches(req, res) {
  const matches = await Match.find()
    .select("_id title startTime status tournament")
    .sort({ startTime: 1 });

  res.json(matches);
}
