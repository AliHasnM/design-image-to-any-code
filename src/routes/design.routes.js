import { Router } from "express";
import {
  createDesign,
  getDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
} from "../controllers/design.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // Assuming you have a multer middleware for image uploads

// Create a new router instance
const router = Router();

// Define a POST route to create a new design
router.route("/").post(
  verifyJWT, // Ensure the user is authenticated
  upload.single("imageUrl"), // Handle file upload for the design image
  createDesign, // Call the createDesign controller
);

// Define a GET route to retrieve all designs
router.route("/").get(verifyJWT, getDesigns);

// Define a GET route to retrieve a design by its ID
router.route("/:id").get(verifyJWT, getDesignById);

// Define a PATCH route to update a design
router.route("/:id").patch(
  verifyJWT, // Ensure the user is authenticated
  upload.single("imageUrl"), // Handle file upload if the image is being updated
  updateDesign, // Call the updateDesign controller
);

// Define a DELETE route to delete a design
router.route("/:id").delete(verifyJWT, deleteDesign);

// Export the router to be used in other parts of the application
export default router;
