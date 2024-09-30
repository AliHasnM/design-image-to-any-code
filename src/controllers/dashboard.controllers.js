import { asyncHandler } from "../utils/asyncHandler.js";
import { Code } from "../models/code.model.js"; // Assuming you have a Code model
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Fetch the user's dashboard stats
// Fetch the user's dashboard stats
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.params.id; // Extracting user ID from the URL params

  // Try to find the dashboard for the given user
  let dashboard = await Code.findOne({ user: userId });

  if (!dashboard) {
    // If dashboard doesn't exist, you can create a default one or return a message
    dashboard = await Dashboard.create({
      user: userId,
      totalGeneratedCodes: 0,
      totalUploads: 0,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, dashboard, "Dashboard data fetched successfully"),
    );
});

export { getDashboard };
