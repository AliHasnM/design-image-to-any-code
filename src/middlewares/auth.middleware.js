import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to verify JWT (JSON Web Token)
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // Retrieve the token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // If no token is provided, throw an unauthorized error
    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    // Verify the token using the secret key
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user by ID from the decoded token, excluding password and refreshToken fields
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    // If the user is not found, throw an invalid access token error
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // Attach the user to the request object
    req.user = user;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If an error occurs, throw an unauthorized error
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
