import { Router } from "express";
import { adminAuthMiddleware } from "../middlewares/adminAuth.middleware.js";
import {
  createOverrideController,
  getOverrideController,
  deleteOverrideController,
} from "../controllers/winnerOverride.controller.js";

const router = Router();

router.use(adminAuthMiddleware);

/**
 * ADMIN: Winner Override
 * POST   /api/admin/quizzes/:quizId/override  — create override
 * GET    /api/admin/quizzes/:quizId/override  — get current override
 * DELETE /api/admin/quizzes/:quizId/override  — remove override
 */
router.post("/:quizId/override", createOverrideController);
router.get("/:quizId/override", getOverrideController);
router.delete("/:quizId/override", deleteOverrideController);

export default router;
