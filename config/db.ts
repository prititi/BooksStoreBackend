import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURL = process.env.MONGO_URL || "";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB !");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

export default mongoose.connection;
