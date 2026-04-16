import { Router } from "express";
import { listUsersController } from "../controllers/adminUsers.controller.js";

const router = Router();

router.get("/", listUsersController);

export default router;
