import jwt from "jsonwebtoken";

export function signAdminToken(admin) {
  return jwt.sign(
    {
      sub: admin._id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
