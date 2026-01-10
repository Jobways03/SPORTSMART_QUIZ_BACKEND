import { Router } from "express";
import { responseStatusController } from "../controllers/responseStatus.controller.js";

const router = Router();

/**
 * USER Response status API
 */
router.get("/status", responseStatusController);

export default router;
