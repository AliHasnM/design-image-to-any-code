import { asyncHandler } from "../utils/asyncHandler.js"; // Async handler utility for error handling
import { ApiError } from "../utils/ApiError.js"; // Custom error handling class
import { User } from "../models/user.model.js"; // User model for MongoDB
import { uploadDesignImage } from "../utils/cloudinary.js"; // Utility for uploading images to Cloudinary
import { ApiResponse } from "../utils/ApiResponse.js"; // Custom response handling class
import jwt from "jsonwebtoken"; // JWT for token generation
import mongoose from "mongoose"; // Mongoose for MongoDB interaction

// Access aur Refresh Tokens generate karne ka function
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Refresh aur access token generate karte waqt kuch galat hua",
    );
  }
};

// User registration ke liye handler
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, fullName } = req.body;

  if (
    [username, email, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Sab fields required hain");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(
      409,
      "Email ya username ke saath user pehle se maujood hai",
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file zaroori hai - multer upload nahi hua");
  }

  const avatar = await uploadDesignImage(avatarLocalPath);
  const coverImage = await uploadDesignImage(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(
      400,
      "Avatar file zaroori hai - cloudinary upload nahi hua",
    );
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "User ko register karte waqt kuch galat hua");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User successfully register hua"));
});

// User login karne ka handler
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "Username ya email zaroori hai");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User nahi milta");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User successfully logged In",
      ),
    );
});

// User logout karne ka handler
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User successfully logged Out"));
});

// Access token refresh karne ka handler
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token expired ya used hai");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token successfully refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

// Current user's password change karne ka function
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password successfully changed"));
});

// Current user's details hasil karne ka function
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw new ApiError(404, "User nahi milta");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current User fetched successfully"));
});

// Current user ko update karne ka function
const updateCurrentUser = asyncHandler(async (req, res) => {
  const { fullName, username, email } = req.body;
  const user = await User.findById(req.user?._id);

  const isUsernameExist = await User.findOne({
    username,
    _id: { $ne: user._id },
  });
  const isEmailExist = await User.findOne({ email, _id: { $ne: user._id } });

  if (isUsernameExist) {
    throw new ApiError(409, "Ye username pehle se maujood hai");
  }
  if (isEmailExist) {
    throw new ApiError(409, "Ye email pehle se maujood hai");
  }

  user.fullName = fullName;
  user.username = username.toLowerCase();
  user.email = email;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current User updated successfully"));
});

// User ko delete karne ka function
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User nahi milta");
  }

  await User.findByIdAndDelete(req.user?._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User successfully deleted"));
});

// Get image history of the user
const getImageHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "images", // Collection name for images
        localField: "_id",
        foreignField: "userId", // Assuming images have a userId field
        as: "imageHistory",
      },
    },
  ]);

  if (!user || user.length === 0) {
    throw new ApiError(404, "User ki koi image history nahi hai");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].imageHistory,
        "User image history fetched successfully",
      ),
    );
});

// Update user avatar and cover image
const updateUserAvatarAndCoverImage = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User nahi milta");
  }

  if (avatarLocalPath) {
    const avatar = await uploadDesignImage(avatarLocalPath);
    user.avatar = avatar.url; // Update avatar URL in user object
  }

  if (coverImageLocalPath) {
    const coverImage = await uploadDesignImage(coverImageLocalPath);
    user.coverImage = coverImage.url; // Update cover image URL in user object
  }

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user,
        "User avatar aur cover image successfully updated",
      ),
    );
});

// Export all controllers
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateCurrentUser,
  deleteUser,
  getImageHistory,
  updateUserAvatarAndCoverImage,
};
