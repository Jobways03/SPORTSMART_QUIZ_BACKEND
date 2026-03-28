import { Router } from "express";
import {
  phoneLogin,
  phoneRegister,
} from "../controllers/authUser.controller.js";

const router = Router();

router.post("/login", phoneLogin);
router.post("/register", phoneRegister);

export default router;
