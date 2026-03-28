import { User } from "../models/User.js";

/**
 * POST /api/auth/user/login
 * Body: { phone }
 *
 * If user exists  → return user data  (isNewUser: false)
 * If user missing → return flag       (isNewUser: true)
 */
export async function phoneLogin(req, res) {
  const { phone } = req.body;

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Valid 10-digit phone number is required" });
  }

  const user = await User.findOne({ phone });

  if (!user) {
    return res.json({ isNewUser: true });
  }

  res.json({
    isNewUser: false,
    userId: user._id,
    name: user.name,
    phone: user.phone,
  });
}

/**
 * POST /api/auth/user/register
 * Body: { phone, name }
 *
 * Creates a new user with phone + name, returns user data.
 */
export async function phoneRegister(req, res) {
  const { phone, name } = req.body;

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ message: "Valid 10-digit phone number is required" });
  }

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  }

  const exists = await User.findOne({ phone });
  if (exists) {
    return res.status(400).json({ message: "User already exists with this phone number" });
  }

  const user = await User.create({ name: name.trim(), phone });

  res.json({
    isNewUser: false,
    userId: user._id,
    name: user.name,
    phone: user.phone,
  });
}
