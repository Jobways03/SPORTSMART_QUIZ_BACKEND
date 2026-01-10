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

  const existing = await Admin.findOne({ email });

  if (existing) {
    console.log("✅ Admin already exists:", email);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await Admin.create({
    email,
    passwordHash,
    role: "SUPER_ADMIN",
  });

  console.log("✅ Admin created");
  console.log("📧 Email:", email);
  console.log("🔑 Password:", password);

  await mongoose.disconnect();
}

seedAdmin().catch(async (err) => {
  console.error("❌ Failed to seed admin:", err);
  await mongoose.disconnect();
  process.exit(1);
});
