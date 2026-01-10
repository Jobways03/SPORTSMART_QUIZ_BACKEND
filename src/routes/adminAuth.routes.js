import { Router } from "express";
import { adminLoginController } from "../controllers/adminAuth.controller.js";

const router = Router();

/**
 * ADMIN Auth
 */
router.post("/login", adminLoginController);

export default router;
