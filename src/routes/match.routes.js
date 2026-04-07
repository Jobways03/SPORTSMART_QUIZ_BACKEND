import { Router } from "express";
import {
  createMatchController,
  listMatchesController,
  getMatchController,
  updateMatchController,
  deleteMatchController,
  listadminMatchesController,
  setWinnerController,
} from "../controllers/match.controller.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

/**
 * ADMIN Match APIs
 */
router.post("/", upload.single("coverImage"), createMatchController);
router.get("/admin", listadminMatchesController);
router.get("/", listMatchesController);
router.get("/:matchId", getMatchController);
router.patch("/:matchId", upload.single("coverImage"), updateMatchController);
router.patch("/:matchId/winner", upload.single("winnerPhoto"), setWinnerController);
router.delete("/:matchId", deleteMatchController);

export default router;
