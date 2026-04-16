import { Quiz } from "../models/Quiz.js";
import { User } from "../models/User.js";
import { Response } from "../models/Response.js";
import { WinnerOverride } from "../models/WinnerOverride.js";
import { uploadToCloudinary } from "../middlewares/upload.js";

/**
 * Create a system-generated winner override for a quiz.
 * Only allowed before results are published.
 * Only one override per quiz is permitted.
 */
export async function createWinnerOverride({ quizId, displayName, phone, score, adminId, photoBuffer }) {
  if (!displayName || !displayName.trim()) {
    throw new Error("DISPLAY_NAME_REQUIRED");
  }

  const parsedScore = Number(score);
  if (isNaN(parsedScore) || parsedScore < 0) {
    throw new Error("INVALID_SCORE");
  }

  // Validate phone if provided
  if (phone && !/^\d{10}$/.test(phone)) {
    throw new Error("INVALID_PHONE");
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("QUIZ_NOT_FOUND");

  if (quiz.isResultPublished) throw new Error("ALREADY_PUBLISHED");

  const existing = await WinnerOverride.findOne({ quizId });
  if (existing) throw new Error("OVERRIDE_EXISTS");

  // Upload photo to Cloudinary if provided
  let photoUrl;
  if (photoBuffer) {
    const uploaded = await uploadToCloudinary(photoBuffer, "winner-overrides");
    photoUrl = uploaded.secure_url;
  }

  const userPayload = {
    name: displayName.trim(),
    isSystemGenerated: true,
  };
  if (phone) userPayload.phone = phone;
  if (photoUrl) userPayload.photo = photoUrl;

  // Create a system-generated user — email/password omitted (sparse/optional)
  // If phone already exists in DB, create without phone to avoid duplicate key error
  let systemUser;
  try {
    systemUser = await User.create(userPayload);
  } catch (err) {
    if (err.code === 11000 && userPayload.phone) {
      delete userPayload.phone;
      systemUser = await User.create(userPayload);
    } else {
      throw err;
    }
  }

  // Create a pre-scored response (answers array is empty — manually scored)
  const overrideResponse = await Response.create({
    quizId,
    matchId: quiz.matchId,
    userId: systemUser._id,
    answers: [],
    score: parsedScore,
    isScored: true,
    isOverride: true,
    submittedAt: new Date(),
  });

  const override = await WinnerOverride.create({
    quizId,
    userId: systemUser._id,
    score: parsedScore,
    createdBy: adminId,
  });

  return {
    override: {
      _id: override._id,
      quizId: override.quizId,
      userId: systemUser._id,
      displayName: systemUser.name,
      phone: systemUser.phone || null,
      photo: systemUser.photo || null,
      score: override.score,
      createdBy: override.createdBy,
      createdAt: override.createdAt,
    },
    responseId: overrideResponse._id,
  };
}

/**
 * Get the current winner override for a quiz, if any.
 * Returns null if no override exists.
 */
export async function getWinnerOverride(quizId) {
  const override = await WinnerOverride.findOne({ quizId }).populate(
    "userId",
    "name phone photo isSystemGenerated"
  );

  if (!override) return null;

  return {
    _id: override._id,
    quizId: override.quizId,
    userId: override.userId._id,
    displayName: override.userId.name,
    phone: override.userId.phone || null,
    photo: override.userId.photo || null,
    score: override.score,
    createdBy: override.createdBy,
    createdAt: override.createdAt,
  };
}

/**
 * Delete the winner override for a quiz.
 * Only allowed before results are published.
 * Cleans up: WinnerOverride record, Response, system-generated User.
 */
export async function deleteWinnerOverride(quizId) {
  const override = await WinnerOverride.findOne({ quizId });
  if (!override) throw new Error("OVERRIDE_NOT_FOUND");

  const quiz = await Quiz.findById(quizId);
  if (quiz && quiz.isResultPublished) throw new Error("ALREADY_PUBLISHED");

  // Remove the override response
  await Response.deleteOne({ quizId, userId: override.userId, isOverride: true });

  // Remove the system-generated user (safety: only if flagged)
  await User.deleteOne({ _id: override.userId, isSystemGenerated: true });

  // Remove the override record
  await WinnerOverride.deleteOne({ _id: override._id });

  return true;
}
