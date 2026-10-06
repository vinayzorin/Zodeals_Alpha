import mongoose from "mongoose";

// Connection string is read from the environment (set MONGODB_URI on Railway).
// Railway's MongoDB plugin exposes MONGO_URL, which is also accepted.
const LOCAL_URL = "mongodb://localhost:27017/zo_deals";

const MONGO_URI =
  process.env.MONGODB_URI || process.env.MONGO_URL || LOCAL_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      autoCreate: false,
    });
    console.log("✅ Connected to MongoDB");
  } catch (dbError) {
    console.error("❌ MongoDB connection failed", dbError);
    return;
  }

  // Legacy cleanup: drop an old unique index if it still exists.
  try {
    await mongoose.connection.collection("agents").dropIndex("code_1");
  } catch {
    // Index doesn't exist — nothing to do.
  }
};
