import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT || 8000;

async function startServer() {
  await connectDB(process.env.MONGO_URI);

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Server failed to start", err);
  process.exit(1);
});
