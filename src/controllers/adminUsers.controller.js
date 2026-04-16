import { User } from "../models/User.js";
import { Response } from "../models/Response.js";

/**
 * GET /api/admin/users
 * Returns all users with attempt count and total score.
 */
export async function listUsersController(_req, res, next) {
  try {
    const users = await User.find().select("name phone email createdAt").sort({ createdAt: -1 });

    // Aggregate attempt count + total score per user
    const stats = await Response.aggregate([
      {
        $group: {
          _id: "$userId",
          attempts: { $sum: 1 },
          totalScore: { $sum: "$score" },
        },
      },
    ]);

    const statsMap = {};
    for (const s of stats) {
      statsMap[s._id.toString()] = { attempts: s.attempts, totalScore: s.totalScore };
    }

    const result = users.map((u) => {
      const s = statsMap[u._id.toString()] || { attempts: 0, totalScore: 0 };
      return {
        _id: u._id,
        name: u.name,
        phone: u.phone || null,
        email: u.email || null,
        attempts: s.attempts,
        totalScore: s.totalScore,
        joinedAt: u.createdAt,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}
