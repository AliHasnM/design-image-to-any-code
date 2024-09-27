import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserImageCodeHistory } from "../controllers/dashboard.controllers.js";

const router = Router();

// Define a GET route to get user's image and code history
router.route("/image-code-history").get(verifyJWT, getUserImageCodeHistory);

// Export the router to be used in other parts of the application
export default router;
