import mongoose from "mongoose";

const ATLAS_URL =
  "mongodb://lohith:zodeals123%23%23@srv1127975.hstgr.cloud:27017/zo_deals?authSource=zo_deals&directConnection=true";

const LOCAL_URL =
  "mongodb://8367256082:Upendra123@localhost:27017/zo_deals?authSource=admin";

export const connectDB = async () => {
  try {
    await mongoose.connect(LOCAL_URL, {
      serverSelectionTimeoutMS: 10000,
      autoCreate: false,
    });
    console.log("✅ Connected to MongoDB Atlas");
    await mongoose.connection.collection("agents").dropIndex("code_1");
    
  } catch (atlasError) {
    console.warn("⚠️ Atlas failed, trying Local MongoDB...",atlasError);
  }
};
