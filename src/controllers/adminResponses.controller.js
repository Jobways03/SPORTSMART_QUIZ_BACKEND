import { getQuizResponses } from "../services/adminResponses.service.js";

export async function adminResponsesController(req, res, next) {
  try {
    const { quizId } = req.params;

    const responses = await getQuizResponses(quizId);

    res.json({ responses });
  } catch (err) {
    next(err);
  }
}

export async function exportResponsesCSVController(req, res, next) {
  try {
    const { quizId } = req.params;

    const responses = await getQuizResponses(quizId);

    let csv = "Name,Phone,Score,Submitted At\n";

    responses.forEach((r) => {
      csv += `${r.user.name},${r.user.phone},${
        r.score ?? ""
      },${r.submittedAt.toISOString()}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="quiz_${quizId}_responses.csv"`
    );

    res.send(csv);
  } catch (err) {
    next(err);
  }
}
