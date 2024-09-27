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
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image", // We specify image type
    });
    fs.unlinkSync(localFilePath); // Remove local file after uploading
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Cleanup in case of failure
    return null;
  }
};

export { uploadDesignImage };
