import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

// Database Connection (try_catch and async_await)
const connectDB = async () => {
  try {
    // Establish connection to MongoDB
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    // Log a success message on connection
    console.log(
      `\n MongoDB Connected !! DB Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    // Handle connection error
    console.log("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// Export the connectDB function as default
export default connectDB;
