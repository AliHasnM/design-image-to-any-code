import mongoose from "mongoose";
import { Design } from "../models/design.model.js"; // Assuming an Image model exists
import { Code } from "../models/code.model.js"; // Assuming a Code model exists
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get user's image and code history
const getUserImageCodeHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Assuming user ID is set in req.user by JWT middleware

  // Fetch all images uploaded by the user
  const images = await Image.find({ userId }).populate("codeId"); // Populate with associated code details

  if (!images) {
    throw new ApiError(404, "No images found for this user");
  }

  // Prepare response data
  const responseData = images.map((image) => ({
    imageUrl: image.imageUrl, // Adjust according to your image model field
    code: image.codeId ? image.codeId.code : null, // Adjust according to your code model field
    createdAt: image.createdAt,
  }));

  // Return the image and code history as a response
  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "User Image and Code History"));
});

export { getUserImageCodeHistory };
