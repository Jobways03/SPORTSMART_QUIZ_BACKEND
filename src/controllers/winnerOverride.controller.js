import {
  createWinnerOverride,
  getWinnerOverride,
  deleteWinnerOverride,
} from "../services/winnerOverride.service.js";

export async function createOverrideController(req, res, next) {
  try {
    const { quizId } = req.params;
    const { displayName, phone, score } = req.body;
    const adminId = req.admin?.sub;

    const result = await createWinnerOverride({ quizId, displayName, phone, score, adminId });

    return res.status(201).json({
      message: "Winner override created successfully",
      ...result,
    });
  } catch (err) {
    if (err.message === "DISPLAY_NAME_REQUIRED") {
      return res.status(400).json({ message: "Display name is required" });
    }
    if (err.message === "INVALID_SCORE") {
      return res.status(400).json({ message: "Score must be a non-negative number" });
    }
    if (err.message === "INVALID_PHONE") {
      return res.status(400).json({ message: "Phone must be exactly 10 digits" });
    }
    if (err.message === "QUIZ_NOT_FOUND") {
      return res.status(404).json({ message: "Quiz not found" });
    }
    if (err.message === "ALREADY_PUBLISHED") {
      return res.status(400).json({ message: "Cannot override after results are published" });
    }
    if (err.message === "OVERRIDE_EXISTS") {
      return res.status(409).json({
        message: "An override already exists for this quiz. Delete it first.",
      });
    }
    next(err);
  }
}

export async function getOverrideController(req, res, next) {
  try {
    const { quizId } = req.params;

    const override = await getWinnerOverride(quizId);

    return res.json({ override }); // null if none
  } catch (err) {
    next(err);
  }
}

export async function deleteOverrideController(req, res, next) {
  try {
    const { quizId } = req.params;

    await deleteWinnerOverride(quizId);

    return res.json({ message: "Winner override removed successfully" });
  } catch (err) {
    if (err.message === "OVERRIDE_NOT_FOUND") {
      return res.status(404).json({ message: "No override found for this quiz" });
    }
    if (err.message === "ALREADY_PUBLISHED") {
      return res.status(400).json({ message: "Cannot remove override after results are published" });
    }
    next(err);
  }
}
