import { Router } from "express";
import { submitResponseController } from "../controllers/response.controller.js";

const router = Router();

/**
 * USER Response API
 */
router.post("/submit", submitResponseController);

export default router;
