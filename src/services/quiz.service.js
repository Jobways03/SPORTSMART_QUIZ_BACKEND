import { Quiz } from "../models/Quiz.js";

export async function createQuiz(data) {
  return Quiz.create(data);
}

export async function getQuizzesByMatch(matchId) {
  return Quiz.find({ matchId }).sort({ createdAt: -1 });
}

export async function getQuizById(quizId) {
  return Quiz.findById(quizId);
}

export async function updateQuiz(quizId, updateData) {
  return Quiz.findByIdAndUpdate(quizId, updateData, { new: true });
}
