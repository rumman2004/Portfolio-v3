import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

// Use unsigned upload with an upload preset to bypass product-environment permission restrictions.
// Create an UNSIGNED upload preset named "portfolio_uploads" in your Cloudinary Settings → Upload page.
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || "portfolio_uploads";

export const uploadToCloudinary = async (fileBuffer, folder = "portfolio") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, upload_preset: UPLOAD_PRESET, unsigned: true },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (url) => {
  try {
    if (!url) return;
    // Extract public_id from URL
    const publicId = url.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
  }
};

export default cloudinary;