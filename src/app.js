import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import userAuthRoutes from "./routes/auth.user.routes.js";
import matchRoutes from "./routes/match.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import questionRoutes from "./routes/question.routes.js";
import userQuizRoutes from "./routes/userQuiz.routes.js";
import responseRoutes from "./routes/response.routes.js";
import responseStatusRoutes from "./routes/responseStatus.routes.js";
import adminAnswerRoutes from "./routes/adminAnswer.routes.js";
import adminScoringRoutes from "./routes/adminScoring.routes.js";
import adminPublishRoutes from "./routes/adminPublish.routes.js";
import userResultRoutes from "./routes/userResult.routes.js";
import leaderboardRoutes from "./routes/leaderboard.routes.js";
import adminResponsesRoutes from "./routes/adminResponses.routes.js";
import adminAnalyticsRoutes from "./routes/adminAnalytics.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import { adminAuthMiddleware } from "./middlewares/adminAuth.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import publicMatchesRoutes from "./routes/publicMatches.routes.js";
import newadminAnalyticsRoutes from "./routes/admin.analytics.routes.js"

export function createApp() {
  const app = express();

const allowedOrigins = [
  "https://sportsmart.com",
  "https://sportsmart.ai",
  "https://www.sportsmart.com",
  "https://www.sportsmart.ai",
  "https://seller.sportsmart.com",
  "http://localhost:3000", // optional for local
  "http://localhost:5173",
  "https://sportsmart-quiz-frontend.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman, curl

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: "*",
    credentials: true, // important
  })
);


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.send("Cricket Match Quiz API running");
  });

  app.use("/api/health", healthRoutes);
  app.use("/api/auth/user", userAuthRoutes);
  app.use("/api/quizzes", userQuizRoutes);
  app.use("/api/responses", responseRoutes);
  app.use("/api/responses", responseStatusRoutes);
  app.use("/api/results", userResultRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);
  app.use("/api/matches", publicMatchesRoutes);

  app.use("/api/admin/auth", adminAuthRoutes);

  //   app.use("/api/admin", adminAuthMiddleware);

  app.use("/api/admin/matches", matchRoutes);
  app.use("/api/admin/quizzes", quizRoutes);
  app.use("/api/admin/questions", questionRoutes);
  app.use("/api/admin/analytics", newadminAnalyticsRoutes);
  app.use("/api/admin", adminAnswerRoutes);
  app.use("/api/admin", adminScoringRoutes);
  app.use("/api/admin", adminPublishRoutes);
  app.use("/api/admin", adminResponsesRoutes);
  app.use("/api/admin", adminAnalyticsRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  //   app.use((err, req, res, next) => {
  //     console.error(err);
  //     res.status(500).json({ message: "Internal server error" });
  //   });

  app.use(errorMiddleware);

  return app;
}
