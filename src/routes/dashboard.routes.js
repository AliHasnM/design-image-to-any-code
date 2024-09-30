import express from "express";
import { getDashboard } from "../controllers/dashboard.controllers.js"; // Adjust the path if needed
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Assuming you have authentication middleware

const router = express.Router();

// Fetch dashboard data for a specific user based on the userId passed in params
router.route("/:id").get(verifyJWT, getDashboard);

export default router;
