import axios from "axios";
import openai from "../utils/openai.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Code } from "../models/code.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadDesignImage } from "../utils/cloudinary.js";

// Naya code banane ka function with OpenAI GPT integration (Complete)
const createCode = asyncHandler(async (req, res) => {
  const { codeType } = req.body;
  const userId = req.user?._id;

  // Ensure a file was uploaded
  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  // Upload image to Cloudinary
  const imageFileLocalPath = req.file.path;
  const imageFile = await uploadDesignImage(imageFileLocalPath);

  if (!imageFile) {
    throw new ApiError(400, "Failed to upload Image to Cloudinary");
  }

  // Create the prompt for OpenAI
  const prompt = `
    Analyze this design: ${imageFile.secure_url} and generate ${codeType} code for a responsive web page.
    Make sure to use best practices for modern web development.
  `;

  console.log("Prompt sent to OpenAI:", prompt);

  let generatedCode;
  try {
    // Correct OpenAI SDK v4 method
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
    });

    // Check if `choices` exists in the response
    if (response.choices && response.choices.length > 0) {
      generatedCode = response.choices[0].message.content.trim();
    } else {
      throw new ApiError(
        500,
        "Code generation failed: No valid choices returned",
      );
    }
  } catch (error) {
    console.error("Error in code generation:", error);
    const errorMessage = error.response?.data || error.message;
    console.error("Error details:", errorMessage);
    throw new ApiError(
      500,
      `OpenAI code generation service failed: ${errorMessage}`,
    );
  }

  // Save generated code to the database
  const newCode = await Code.create({
    design: imageFile.secure_url,
    generatedCode,
    codeType,
    user: userId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newCode, "Code successfully generated"));
});

// Retrieve all generated codes
const getCodes = asyncHandler(async (req, res) => {
  const codes = await Code.find().populate("design", "title");
  return res
    .status(200)
    .json(new ApiResponse(200, codes, "All codes fetched successfully"));
});

// Retrieve a specific code by its ID
const getCodeById = asyncHandler(async (req, res) => {
  const code = await Code.findById(req.params.id).populate("design", "title");

  if (!code) {
    throw new ApiError(404, "Code not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, code, "Code fetched successfully"));
});

// Update a specific code by its ID
const updateCode = asyncHandler(async (req, res) => {
  const code = await Code.findById(req.params.id);

  if (!code) {
    throw new ApiError(404, "Code not found");
  }

  const { generatedCode, codeType } = req.body;

  // Update the code
  code.generatedCode = generatedCode || code.generatedCode;
  code.codeType = codeType || code.codeType;

  await code.save();

  return res
    .status(200)
    .json(new ApiResponse(200, code, "Code updated successfully"));
});

// Delete a specific code by its ID
const deleteCode = asyncHandler(async (req, res) => {
  const code = await Code.findById(req.params.id);

  if (!code) {
    throw new ApiError(404, "Code not found");
  }

  await Code.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Code successfully deleted"));
});

// Exporting functions to use in routes
export { createCode, getCodes, getCodeById, updateCode, deleteCode };
