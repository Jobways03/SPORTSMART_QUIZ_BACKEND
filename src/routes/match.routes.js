import { Router } from "express";
import {
  createMatchController,
  listMatchesController,
  getMatchController,
  updateMatchController,
  deleteMatchController,
  listadminMatchesController,
} from "../controllers/match.controller.js";
import { upload } from "../middlewares/upload.js";

const router = Router();

/**
 * ADMIN Match APIs
 */
router.post("/", upload.single("coverImage"), createMatchController);
router.get("/", listMatchesController);
router.get("/admin", listadminMatchesController);
router.get("/:matchId", getMatchController);
router.patch("/:matchId", updateMatchController);
router.delete("/:matchId", deleteMatchController);

export default router;
