import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { signAdminToken } from "../utils/jwt.js";

export async function adminLoginController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = signAdminToken(admin);

    res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
}
