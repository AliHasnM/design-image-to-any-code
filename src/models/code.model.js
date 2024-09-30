import mongoose, { Schema } from "mongoose";

// Creating the code schema
const codeSchema = new Schema(
  {
    design: {
      type: String, // Cloudinary url
      required: true,
    },
    generatedCode: {
      type: String, // Cloudinary url
      required: true,
    },
    codeType: {
      type: String, // Type of code generated (e.g., HTML, CSS, React)
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the user who uploaded the design
      required: true,
    },
  },
  { timestamps: true },
);

// Exporting the Code model
export const Code = mongoose.model("Code", codeSchema);
