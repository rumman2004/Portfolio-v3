import {
  createHackathon,
  deleteHackathon,
  getFeaturedHackathons,
  getHackathonById,
  getHackathonBySlug,
  getHackathons,
  getStats,
  updateHackathon,
} from "./hackathon.service.js";
import Hackathon from "./hackathon.model.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";
import { cleanupCloudinaryUrls } from "../../utils/assetCleanup.js";

const cleanupHackathonImages = async (urls, excludedHackathonId) => {
  const uniqueUrls = [...new Set(urls.filter(Boolean))];
  if (uniqueUrls.length === 0) return;

  const filter = { image: { $in: uniqueUrls } };
  if (excludedHackathonId) {
    filter._id = { $ne: excludedHackathonId };
  }

  let references;
  try {
    references = await Hackathon.find(filter).select("image").lean();
  } catch (error) {
    console.error("Hackathon image reference check failed:", error.message);
    return;
  }

  const referencedUrls = new Set(
    references.map((hackathon) => hackathon.image).filter(Boolean)
  );

  await cleanupCloudinaryUrls(uniqueUrls, {
    allowedFolders: ["portfolio/hackathons"],
    isReferenced: (url) => referencedUrls.has(url),
  });
};

const rethrowInvalidImage = (error) => {
  if (error?.code === "INVALID_IMAGE") {
    throw error;
  }
};

export const listHackathons = async (req, res, next) => {
  try {
    const hackathons = await getHackathons();

    res.status(200).json({
      success: true,
      count: hackathons.length,
      data: hackathons,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminHackathons = async (req, res, next) => {
  try {
    const hackathons = await getHackathons({ admin: true });

    res.status(200).json({
      success: true,
      count: hackathons.length,
      data: hackathons,
    });
  } catch (error) {
    next(error);
  }
};

export const listFeaturedHackathons = async (req, res, next) => {
  try {
    const hackathons = await getFeaturedHackathons();

    res.status(200).json({
      success: true,
      count: hackathons.length,
      data: hackathons,
    });
  } catch (error) {
    next(error);
  }
};

export const getHackathon = async (req, res, next) => {
  try {
    const hackathon = await getHackathonBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: hackathon,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const addHackathon = async (req, res, next) => {
  const uploadedImageUrls = [];

  try {
    const payload = { ...req.body };
    const uploadWarnings = [];

    if (req.file) {
      try {
        payload.image = await uploadToCloudinary(req.file.buffer, "portfolio/hackathons");
        uploadedImageUrls.push(payload.image);
      } catch (uploadErr) {
        rethrowInvalidImage(uploadErr);
        console.error("Hackathon image upload failed:", uploadErr.message);
        uploadWarnings.push("Image upload failed: " + (uploadErr.http_code === 403 ? "Cloudinary credentials are invalid." : uploadErr.message));
      }
    } else if (String(payload.removeImage).toLowerCase() === "true") {
      payload.image = "";
    }
    delete payload.removeImage;
    const hackathon = await createHackathon(payload);

    res.status(201).json({
      success: true,
      message: uploadWarnings.length > 0
        ? "Hackathon created, but image upload failed: " + uploadWarnings.join("; ")
        : "Hackathon created successfully",
      ...(uploadWarnings.length > 0 ? { warnings: uploadWarnings } : {}),
      data: hackathon,
    });
  } catch (error) {
    await cleanupHackathonImages(uploadedImageUrls);
    next(error);
  }
};

export const editHackathon = async (req, res, next) => {
  const uploadedImageUrls = [];

  try {
    const previousHackathon = await getHackathonById(req.params.id);
    const payload = { ...req.body };
    const uploadWarnings = [];

    if (req.file) {
      try {
        payload.image = await uploadToCloudinary(req.file.buffer, "portfolio/hackathons");
        uploadedImageUrls.push(payload.image);
      } catch (uploadErr) {
        rethrowInvalidImage(uploadErr);
        console.error("Hackathon image upload failed:", uploadErr.message);
        uploadWarnings.push("Image upload failed: " + (uploadErr.http_code === 403 ? "Cloudinary credentials are invalid." : uploadErr.message));
        delete payload.image;
      }
    } else if (String(payload.removeImage).toLowerCase() === "true") {
      payload.image = "";
    }
    delete payload.removeImage;
    const hackathon = await updateHackathon(req.params.id, payload);

    if (previousHackathon.image && previousHackathon.image !== hackathon.image) {
      await cleanupHackathonImages([previousHackathon.image], hackathon._id);
    }

    res.status(200).json({
      success: true,
      message: uploadWarnings.length > 0
        ? "Hackathon saved, but image upload failed: " + uploadWarnings.join("; ")
        : "Hackathon updated successfully",
      ...(uploadWarnings.length > 0 ? { warnings: uploadWarnings } : {}),
      data: hackathon,
    });
  } catch (error) {
    await cleanupHackathonImages(uploadedImageUrls);
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const removeHackathon = async (req, res, next) => {
  try {
    const hackathon = await deleteHackathon(req.params.id);
    await cleanupHackathonImages([hackathon.image]);

    res.status(200).json({
      success: true,
      message: "Hackathon deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const getHackathonStats = async (req, res, next) => {
  try {
    const { totalHackathons, topTenFinishes, winningPositions, projectCount } =
      await getStats();

    res.status(200).json({
      success: true,
      data: [
        { value: `${totalHackathons}+`, label: "Hackathons Participated" },
        { value: `${topTenFinishes}`, label: "Top 10 Finishes" },
        { value: `${winningPositions}`, label: "Winning Positions" },
        { value: `${projectCount}+`, label: "Projects Built" },
      ],
    });
  } catch (error) {
    next(error);
  }
};
