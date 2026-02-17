import { Router } from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  googleCallback,
  verifyGoogleToken,
  updatePhone,
} from "../controllers/authUser.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);

router.get("/google/verify", verifyGoogleToken);

// Phone update (after Google login)
router.post("/update-phone", updatePhone);

export default router;
