import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";
import { User } from "./models/User.js";

const PORT = process.env.PORT || 8000;

async function syncIndexes() {
  try {
    // Drop old non-sparse indexes and let Mongoose recreate them with sparse: true
    const collection = User.collection;
    const indexes = await collection.indexes();

    for (const idx of indexes) {
      // Skip the default _id index
      if (idx.name === "_id_") continue;

      // Drop old unique indexes on phone, email, or googleId that are NOT sparse
      const keys = Object.keys(idx.key);
      if (idx.unique && !idx.sparse && (keys.includes("phone") || keys.includes("email") || keys.includes("googleId"))) {
        console.log(`🔄 Dropping old index: ${idx.name}`);
        await collection.dropIndex(idx.name);
      }
    }

    // Recreate indexes from schema (with sparse: true)
    await User.syncIndexes();
    console.log("✅ User indexes synced");
  } catch (err) {
    console.error("⚠️ Index sync warning:", err.message);
  }
}

async function startServer() {
  await connectDB(process.env.MONGO_URI);
  await syncIndexes();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Server failed to start", err);
  process.exit(1);
});
