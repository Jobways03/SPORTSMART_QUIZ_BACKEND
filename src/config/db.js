import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URI missing");

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err.message);
  });
}
