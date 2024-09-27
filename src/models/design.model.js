import mongoose, { Schema } from "mongoose";

// Creating the design schema
const designSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // URL of the uploaded design image (from Cloudinary)
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the user who uploaded the design
      required: true,
    },
    generatedCode: {
      type: String, // Code generated from the design image
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"], // Status of code generation
      default: "pending",
    },
  },
  { timestamps: true },
);

// Exporting the Design model
export const Design = mongoose.model("Design", designSchema);
