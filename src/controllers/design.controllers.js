import { asyncHandler } from "../utils/asyncHandler.js";
import { Design } from "../models/design.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadDesignImage } from "../utils/cloudinary.js"; // Cloudinary upload utility

// Design banane ka function
const createDesign = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user?._id;

  // Check for uploaded file (using req.file, not req.files)
  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  const imageFileLocalPath = req.file.path;

  // Upload the file to Cloudinary
  const imageFile = await uploadDesignImage(imageFileLocalPath);

  if (!imageFile) {
    throw new ApiError(400, "Failed to upload Image to Cloudinary");
  }

  // Create the new design with the image URL from Cloudinary
  const newDesign = await Design.create({
    title,
    description,
    imageUrl: imageFile.url, // Use Cloudinary URL
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

  // Agar imageUrl update karna hai, toh pehle file ko Cloudinary par upload karen
  if (req.file) {
    const imageFileLocalPath = req.file.path;

    // Upload the new image file to Cloudinary
    const uploadedImage = await uploadDesignImage(imageFileLocalPath);

    if (!uploadedImage) {
      throw new ApiError(400, "Failed to upload Image to Cloudinary");
    }

    // Update the design's imageUrl with the new Cloudinary URL
    design.imageUrl = uploadedImage.url;
  }

  // Update the design's title and description
  design.title = title || design.title;
  design.description = description || design.description;

  // Save the updated design
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
