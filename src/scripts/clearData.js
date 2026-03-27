import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Match } from "../models/Match.js";
import { Quiz } from "../models/Quiz.js";
import { Question } from "../models/Question.js";
import { Response } from "../models/Response.js";
import { WinnerOverride } from "../models/WinnerOverride.js";

async function clearData() {
  await connectDB(process.env.MONGO_URI);

  const results = await Promise.all([
    User.deleteMany({}),
    Match.deleteMany({}),
    Quiz.deleteMany({}),
    Question.deleteMany({}),
    Response.deleteMany({}),
    WinnerOverride.deleteMany({}),
  ]);

  const names = ["User", "Match", "Quiz", "Question", "Response", "WinnerOverride"];
  names.forEach((name, i) => {
    console.log(`🗑️  ${name}: ${results[i].deletedCount} deleted`);
  });

  console.log("\n✅ All data cleared (Admin collection preserved)");
  await mongoose.disconnect();
}

clearData().catch(async (err) => {
  console.error("❌ Failed to clear data:", err);
  await mongoose.disconnect();
  process.exit(1);
});
