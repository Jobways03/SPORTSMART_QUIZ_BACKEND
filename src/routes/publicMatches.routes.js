// routes/publicMatches.routes.js
import express from "express";
import { getPublicMatches } from "../controllers/publicMatches.controller.js";

const router = express.Router();

router.get("/public", getPublicMatches);

export default router;
