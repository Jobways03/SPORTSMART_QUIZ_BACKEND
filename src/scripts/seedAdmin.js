import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { Admin } from "../models/Admin.js";

async function seedAdmin() {
  await connectDB(process.env.MONGO_URI);

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Seed admin email/password missing in env");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await Admin.findOne({ email });

  if (existing) {
    existing.passwordHash = passwordHash;
    await existing.save();
    console.log("✅ Admin updated with new credentials");
  } else {
    await Admin.create({
      email,
      passwordHash,
      role: "SUPER_ADMIN",
    });
    console.log("✅ Admin created");
  }

  console.log("📧 Email:", email);

  await mongoose.disconnect();
}

seedAdmin().catch(async (err) => {
  console.error("❌ Failed to seed admin:", err);
  await mongoose.disconnect();
  process.exit(1);
});
