import { Router } from "express";
import { userResultController } from "../controllers/userResult.controller.js";

const router = Router();

/**
 * USER: View quiz result
 */
router.get("/:quizId/:userId", userResultController);

export default router;
