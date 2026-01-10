import { getQuizAnalytics } from "../services/adminAnalytics.service.js";

export async function adminAnalyticsController(req, res, next) {
  try {
    const { quizId } = req.params;

    const analytics = await getQuizAnalytics(quizId);

    res.json(analytics);
  } catch (err) {
    next(err);
  }
}
