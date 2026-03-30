import {
  createMatch,
  getMatchById,
  updateMatch,
  deleteMatch,
  getMatchesForUser,
  getAllMatches,
  setMatchWinner,
} from "../services/match.service.js";

import { uploadToCloudinary } from "../middlewares/upload.js";

export async function createMatchController(req, res, next) {
  try {
    const { title, tournament, startTime } = req.body;

    if (!title || !startTime) {
      return res
        .status(400)
        .json({ message: "Title and startTime are required" });
    }

    let coverImage = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "matches");
      coverImage = uploadResult.secure_url;
    }

    const match = await createMatch({
      title,
      tournament,
      startTime,
      coverImage,
    });

    res.status(201).json(match);
  } catch (err) {
    next(err);
  }
}


export async function listadminMatchesController(req, res, next) {
  try {
    const { status } = req.query;
    const filters = {};
    if (status) filters.status = status;
    const matches = await getAllMatches(filters);
    res.json(matches);
  } catch (err) {
    next(err);
  }
}


export async function listMatchesController(req, res, next) {
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


export async function getMatchController(req, res, next) {
  try {
    const match = await getMatchById(req.params.matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json(match);
  } catch (err) {
    next(err);
  }
}

export async function updateMatchController(req, res, next) {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "matches");
      updateData.coverImage = uploadResult.secure_url;
    }

    const match = await updateMatch(req.params.matchId, updateData);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json(match);
  } catch (err) {
    next(err);
  }
}

export async function deleteMatchController(req, res, next) {
  try {
    const match = await deleteMatch(req.params.matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }
    res.json({ message: "Match deleted" });
  } catch (err) {
    next(err);
  }
}

export async function setWinnerController(req, res, next) {
  try {
    const { matchId } = req.params;
    const { winnerName, winnerLocation } = req.body;

    const match = await getMatchById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    let winnerPhoto = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "winners");
      winnerPhoto = uploadResult.secure_url;
    }

    const updated = await setMatchWinner(matchId, {
      name: winnerName || null,
      photo: winnerPhoto || match.winner?.photo || null,
      location: winnerLocation || null,
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}
