import { Response } from "../models/Response.js";

export async function hasUserSubmittedQuiz({ quizId, userId }) {
  const existing = await Response.findOne({
    quizId,
    userId,
  }).select("_id");

  return Boolean(existing);
}
