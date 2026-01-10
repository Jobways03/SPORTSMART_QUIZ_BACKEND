import {
  createMatch,
  getMatchById,
  updateMatch,
  deleteMatch,
  getMatchesForUser,
  getAllMatches,
} from "../services/match.service.js";

export async function createMatchController(req, res, next) {
  try {
    const { title, tournament, startTime } = req.body;

    if (!title || !startTime) {
      return res
        .status(400)
        .json({ message: "Title and startTime are required" });
    }

    const match = await createMatch({
      title,
      tournament,
      startTime,
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
    
    const match = await updateMatch(req.params.matchId, req.body)
    
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
