import {
  createCertificate,
  deleteCertificate,
  getCertificateBySlug,
  getCertificates,
  updateCertificate,
} from "./certificate.services.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

export const listCertificates = async (req, res, next) => {
  try {
    const certificates = await getCertificates();

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminCertificates = async (req, res, next) => {
  try {
    const certificates = await getCertificates({ admin: true });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

export const getCertificate = async (req, res, next) => {
  try {
    const certificate = await getCertificateBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const addCertificate = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const uploadWarnings = [];

    if (req.file) {
      try {
        payload.image = await uploadToCloudinary(req.file.buffer, "portfolio/certificates");
      } catch (uploadErr) {
        console.error("Image upload failed:", uploadErr.message);
        uploadWarnings.push("Image upload failed: " + (uploadErr.http_code === 403 ? "Cloudinary credentials are invalid. Please check your .env file." : uploadErr.message));
      }
    }

    const certificate = await createCertificate(payload);

    res.status(201).json({
      success: true,
      message: uploadWarnings.length > 0
        ? "Certificate created, but image upload failed: " + uploadWarnings.join("; ")
        : "Certificate created successfully",
      warnings: uploadWarnings,
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

export const editCertificate = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const uploadWarnings = [];

    if (req.file) {
      try {
        payload.image = await uploadToCloudinary(req.file.buffer, "portfolio/certificates");
      } catch (uploadErr) {
        console.error("Image upload failed:", uploadErr.message);
        uploadWarnings.push("Image upload failed: " + (uploadErr.http_code === 403 ? "Cloudinary credentials are invalid. Please check your CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env" : uploadErr.message));
        delete payload.image;
      }
    }

    const certificate = await updateCertificate(req.params.id, payload);

    res.status(200).json({
      success: true,
      message: uploadWarnings.length > 0
        ? "Certificate saved, but image upload failed: " + uploadWarnings.join("; ")
        : "Certificate updated successfully",
      warnings: uploadWarnings,
      data: certificate,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const removeCertificate = async (req, res, next) => {
  try {
    await deleteCertificate(req.params.id);

    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};
