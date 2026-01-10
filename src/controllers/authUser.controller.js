import crypto from "crypto";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { sendResetEmail } from "../utils/mailer.js";

export async function registerUser(req, res) {
  const { name, email, phone, password } = req.body;

  if (!name || !password || (!email && !phone)) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const exists = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, phone, password });

  res.json({
    userId: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
}

export async function loginUser(req, res) {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  }).select("+password");

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({
    userId: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "If email exists, reset link sent" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  await sendResetEmail(email, token);

  res.json({ message: "Password reset link sent" });
}

export async function resetPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
}
