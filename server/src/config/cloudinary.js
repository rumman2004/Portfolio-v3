import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";
import { convertImageToWebp } from "../utils/image.js";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

// Use unsigned upload with an upload preset to bypass product-environment permission restrictions.
// Create an UNSIGNED upload preset named "portfolio_uploads" in your Cloudinary Settings → Upload page.
const UPLOAD_PRESET = env.cloudinary.uploadPreset;

export const uploadToCloudinary = async (fileBuffer, folder = "portfolio") => {
  const webpBuffer = await convertImageToWebp(fileBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        format: "webp",
        resource_type: "image",
        upload_preset: UPLOAD_PRESET,
        unsigned: true,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url) {
          return reject(new Error("Cloudinary did not return an image URL"));
        }
        if (result.format && String(result.format).toLowerCase() !== "webp") {
          return reject(new Error("Cloudinary stored the image in an unexpected format"));
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(webpBuffer);
  });
};

const findCloudinaryPublicId = (url, allowedFolders = []) => {
  if (typeof url !== "string" || !url.trim()) return null;

  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

    if (
      parsedUrl.hostname !== "res.cloudinary.com" ||
      pathParts[0] !== env.cloudinary.cloudName
    ) {
      return null;
    }

    const uploadIndex = pathParts.indexOf("upload");
    if (uploadIndex < 1 || pathParts[uploadIndex - 1] !== "image") {
      return null;
    }

    const assetParts = pathParts.slice(uploadIndex + 1);
    if (/^v\d+$/.test(assetParts[0] || "")) {
      assetParts.shift();
    }

    const folders = (Array.isArray(allowedFolders)
      ? allowedFolders
      : [allowedFolders]
    )
      .filter(Boolean)
      .map((folder) => String(folder).split("/").filter(Boolean));

    for (const folderParts of folders) {
      const isOwnedFolder = folderParts.every(
        (part, partIndex) => assetParts[partIndex] === part
      );
      if (!isOwnedFolder) continue;

      const publicIdParts = assetParts.slice();
      if (publicIdParts.length <= folderParts.length) continue;

      const lastPart = publicIdParts.at(-1);
      publicIdParts[publicIdParts.length - 1] = lastPart.replace(
        /\.(?:avif|gif|heic|heif|jpeg|jpg|png|svg|tif|tiff|webp)$/i,
        ""
      );

      return publicIdParts.join("/");
    }
  } catch {
    return null;
  }

  return null;
};

export const deleteFromCloudinary = async (url, { allowedFolders = [] } = {}) => {
  const publicId = findCloudinaryPublicId(url, allowedFolders);
  if (!publicId) return { skipped: true };

  const result = await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
    type: "upload",
  });

  return result;
};

export default cloudinary;
