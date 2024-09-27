import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload design image to Cloudinary
const uploadDesignImage = async (localFilePath) => {
  try {
    // Check if local file path is provided
    if (!localFilePath) {
      console.error("No file path provided for upload.");
      return null;
    }

    // Upload image to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Specify resource type as image
    });

    // Remove local file after uploading
    fs.unlinkSync(localFilePath);

    // Log the successful upload response
    console.log("Image uploaded successfully:", response);

    return response; // Return the response from Cloudinary
  } catch (error) {
    console.error("Error uploading image:", error); // Log error for debugging

    // Clean up local file if there is an error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null; // Return null on error
  }
};

export { uploadDesignImage };

// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// // Configure Cloudinary with environment variables
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Upload design image to Cloudinary
// const uploadDesignImage = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "image", // We specify image type
//     });
//     fs.unlinkSync(localFilePath); // Remove local file after uploading
//     return response;
//   } catch (error) {
//     fs.unlinkSync(localFilePath); // Cleanup in case of failure
//     return null;
//   }
// };

// export { uploadDesignImage };
