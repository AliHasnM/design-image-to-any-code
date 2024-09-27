import { asyncHandler } from "../utils/asyncHandler.js";
import { Code } from "../models/code.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Naya code banane ka function
const createCode = asyncHandler(async (req, res) => {
  const { design, generatedCode, codeType } = req.body;

  // Naya code create karna
  const newCode = await Code.create({
    design,
    generatedCode,
    codeType,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newCode, "Code successfully generated"));
});

// Sab generated codes ko dhoondne ka function
const getCodes = asyncHandler(async (req, res) => {
  const codes = await Code.find().populate("design", "title"); // Design ka title bhi include karen
  return res
    .status(200)
    .json(new ApiResponse(200, codes, "All codes fetched successfully"));
});

// Code ko ID se dhoondne ka function
const getCodeById = asyncHandler(async (req, res) => {
  const code = await Code.findById(req.params.id).populate("design", "title");

  if (!code) {
    throw new ApiError(404, "Code nahi milta");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, code, "Code fetched successfully"));
});

// Code ko update karne ka function
const updateCode = asyncHandler(async (req, res) => {
  const code = await Code.findById(req.params.id);

  if (!code) {
    throw new ApiError(404, "Code nahi milta");
  }

  const { generatedCode, codeType } = req.body;

  // Code ko update karna
  code.generatedCode = generatedCode || code.generatedCode;
  code.codeType = codeType || code.codeType;

  await code.save();

  return res
    .status(200)
    .json(new ApiResponse(200, code, "Code updated successfully"));
});

// Code ko delete karne ka function
const deleteCode = asyncHandler(async (req, res) => {
  const code = await Code.findById(req.params.id);

  if (!code) {
    throw new ApiError(404, "Code nahi milta");
  }

  await Code.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Code successfully deleted"));
});

// Exporting functions to use in routes
export { createCode, getCodes, getCodeById, updateCode, deleteCode };
