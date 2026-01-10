import { Router } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "Cricket Match Quiz API",
    dbStatus:
      mongoose.connection.readyState === 1 ? "connected" : "not connected",
    timestamp: new Date().toISOString(),
  });
});

export default router;
