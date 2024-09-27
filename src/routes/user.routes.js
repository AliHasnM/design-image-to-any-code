import express from "express"; // Express framework for routing
import {
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
} from "../controllers/user.controllers.js"; // User controllers
import { upload } from "../middlewares/multer.middleware.js"; // Multer middleware for file uploads
import { verifyJWT } from "../middlewares/auth.middleware.js"; // JWT verification middleware

const router = express.Router(); // Router instance

// User registration route
router.route("/register").post(registerUser);

// User login route
router.route("/login").post(loginUser);

// User logout route
router.route("/logout").post(verifyJWT, logoutUser);

// Refresh access token route
router.route("/refresh-token").post(refreshAccessToken);

// Change current user's password route
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);

// Get current user route
router.route("/me").get(verifyJWT, getCurrentUser); // Updated path to '/me'

// Update current user route
router.route("/update").patch(verifyJWT, updateCurrentUser);

// Delete current user route
router.route("/delete").delete(verifyJWT, deleteUser);

// Get image history route
router.route("/image-history").get(verifyJWT, getImageHistory);

// Update user avatar and cover image route
router
  .route("/update-avatar-cover")
  .patch(verifyJWT, upload.single("file"), updateUserAvatarAndCoverImage); // Ensure to specify the file field

// Export the router
export default router;
