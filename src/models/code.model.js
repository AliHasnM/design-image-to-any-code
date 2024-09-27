import mongoose, { Schema } from "mongoose";

// Creating the code schema
const codeSchema = new Schema(
  {
    design: {
      type: Schema.Types.ObjectId,
      ref: "Design", // Reference to the related design
      required: true,
    },
    generatedCode: {
      type: String, // Generated code from the design
      required: true,
    },
    codeType: {
      type: String, // Type of code generated (e.g., HTML, CSS, React)
      required: true,
    },
  },
  { timestamps: true },
);

// Exporting the Code model
export const Code = mongoose.model("Code", codeSchema);
