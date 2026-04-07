// routes/publicMatches.routes.js
import express from "express";
import { getPublicMatches, getUserMatchesController } from "../controllers/publicMatches.controller.js";

const router = express.Router();

router.get("/public", getPublicMatches);
router.get("/user", getUserMatchesController);

export default router;
