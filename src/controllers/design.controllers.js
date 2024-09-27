import { asyncHandler } from "../utils/asyncHandler.js";
import { Design } from "../models/design.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Design banane ka function
const createDesign = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user?._id;

  // Naya design banate waqt imageUrl ko file se lena
  const imageUrl = req.file.path; // Assuming multer saves the image and provides a path

  const newDesign = await Design.create({
    title,
    description,
    imageUrl,
    user: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newDesign, "Design successfully created"));
});

// Sab designs ko dhoondne ka function
const getDesigns = asyncHandler(async (req, res) => {
  const designs = await Design.find().populate("user", "username"); // User ki username bhi include karen
  return res
    .status(200)
    .json(new ApiResponse(200, designs, "All designs fetched successfully"));
});

// Design ko ID se dhoondne ka function
const getDesignById = asyncHandler(async (req, res) => {
  const design = await Design.findById(req.params.id).populate(
    "user",
    "username",
  );

  if (!design) {
    throw new ApiError(404, "Design nahi milta");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, design, "Design fetched successfully"));
});

// Design ko update karne ka function
const updateDesign = asyncHandler(async (req, res) => {
  const design = await Design.findById(req.params.id);

  if (!design) {
    throw new ApiError(404, "Design nahi milta");
  }

  const { title, description } = req.body;

  // Agar imageUrl update karna hai, toh usse file se lena
  if (req.file) {
    design.imageUrl = req.file.path; // Update imageUrl if a new file is uploaded
  }

  // Design ko update karna
  design.title = title || design.title;
  design.description = description || design.description;

  await design.save();

  return res
    .status(200)
    .json(new ApiResponse(200, design, "Design updated successfully"));
});

// Design ko delete karne ka function
const deleteDesign = asyncHandler(async (req, res) => {
  const design = await Design.findById(req.params.id);

  if (!design) {
    throw new ApiError(404, "Design nahi milta");
  }

  await Design.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Design successfully deleted"));
});

// Exporting functions to use in routes
export { createDesign, getDesigns, getDesignById, updateDesign, deleteDesign };
