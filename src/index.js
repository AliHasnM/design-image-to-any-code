import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

// Load environment variables from .env file
dotenv.config({
  path: "./.env",
});

// Execute the database connection
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error occurred:", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at PORT: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed!", err);
  });
