import mongoose from "mongoose";
import { env } from "./env.js";

let cachedConnection = null;

export const connectDB = async () => {
  try {
    if (cachedConnection) {
      console.log("Using cached MongoDB connection");
      return cachedConnection;
    }

    cachedConnection = await mongoose.connect(env.mongoUrl, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected: ${cachedConnection.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};
