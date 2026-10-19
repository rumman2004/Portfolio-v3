import multer from "multer";
import {
  ImageValidationError,
  MAX_IMAGE_BYTES,
  isSupportedImageMimeType,
  validateImageFile,
} from "../utils/image.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (isSupportedImageMimeType(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ImageValidationError(
        "Only supported JPEG, PNG, WebP, GIF, AVIF, TIFF, HEIF, and SVG images are allowed."
      ),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_BYTES,
    files: 4,
    fields: 50,
    parts: 60,
  },
  fileFilter,
});

export const validateUploadedImages = async (req, res, next) => {
  const files = req.file
    ? [req.file]
    : Object.values(req.files || {}).flat();

  try {
    await Promise.all(files.map((file) => validateImageFile(file)));
    next();
  } catch (error) {
    next(error);
  }
};
