import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    totalGeneratedCodes: {
      type: Number,
      default: 0,
    },
    totalUploads: {
      type: Number,
      default: 0,
    },
    // You can add more fields to track other statistics
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

export const Dashboard = mongoose.model("Dashboard", dashboardSchema);
