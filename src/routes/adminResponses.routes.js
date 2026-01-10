import { Router } from "express";
import {
  adminResponsesController,
  exportResponsesCSVController,
} from "../controllers/adminResponses.controller.js";

const router = Router();

/**
 * ADMIN: View responses & export
 */
router.get("/quizzes/:quizId/responses", adminResponsesController);
router.get("/quizzes/:quizId/responses/export", exportResponsesCSVController);

export default router;
