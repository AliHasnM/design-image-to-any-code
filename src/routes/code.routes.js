import { Router } from "express";
import {
  createCode,
  getCodes,
  getCodeById,
  updateCode,
  deleteCode,
} from "../controllers/code.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

// Create a new router instance
const router = Router();

// Define a POST route to create new generated code
router.route("/").post(verifyJWT, createCode); // Authenticated users can create new code

// Define a GET route to retrieve all generated codes
router.route("/").get(verifyJWT, getCodes); // Authenticated users can retrieve all codes

// Define a GET route to retrieve a generated code by its ID
router.route("/:id").get(verifyJWT, getCodeById); // Authenticated users can retrieve code by ID

// Define a PATCH route to update a generated code
router.route("/:id").patch(verifyJWT, updateCode); // Authenticated users can update code

// Define a DELETE route to delete a generated code
router.route("/:id").delete(verifyJWT, deleteCode); // Authenticated users can delete code by ID

// Export the router to be used in other parts of the application
export default router;
