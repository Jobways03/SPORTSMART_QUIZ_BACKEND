import { Question } from "../models/Question.js";

export async function createQuestion(data) {
  return Question.create(data);
}

export async function getQuestionsByQuiz(quizId) {
  return Question.find({ quizId }).sort({ order: 1 });
}

export async function updateQuestion(questionId, updateData) {
  return Question.findByIdAndUpdate(questionId, updateData, { new: true });
}

export async function deleteQuestion(questionId) {
  return Question.findByIdAndDelete(questionId);
}
