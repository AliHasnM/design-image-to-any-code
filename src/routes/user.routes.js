import express from "express"; // Express framework for routing
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateCurrentUser,
  getImageHistory,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controllers.js"; // User controllers
import { upload } from "../middlewares/multer.middleware.js"; // Multer middleware for file uploads
import { verifyJWT } from "../middlewares/auth.middleware.js"; // JWT verification middleware

const router = express.Router(); // Router instance

// User registration route
router.route("/register").post(
  upload.fields([
    {
      name: "avatar", // Handle file upload for avatar
      maxCount: 1, // Maximum 1 file
    },
    {
      name: "coverImage", // Handle file upload for cover image
      maxCount: 1, // Maximum 1 file
    },
  ]),
  registerUser, // Call the registerUser controller
);

// User login route
router.route("/login").post(loginUser);

// User logout route
router.route("/logout").post(verifyJWT, logoutUser);

// Refresh access token route
router.route("/refresh-token").post(refreshAccessToken);

// Change current user's password route
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);

// Get current user route
router.route("/").get(verifyJWT, getCurrentUser); // Updated path to '/me'

// Update current user route
router.route("/update").patch(verifyJWT, updateCurrentUser);

// Get image history route
router.route("/image-history").get(verifyJWT, getImageHistory);

// Update user avatar and cover image route
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// Export the router
export default router;
