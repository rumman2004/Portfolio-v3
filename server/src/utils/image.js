import sharp from "sharp";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_IMAGE_PIXELS = 40_000_000;

const MIME_TO_FORMAT = new Map([
  ["image/jpeg", "jpeg"],
  ["image/jpg", "jpeg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  // libvips reports AVIF/HEIF input as the shared `heif` format.
  ["image/avif", "heif"],
  ["image/tiff", "tiff"],
  ["image/svg+xml", "svg"],
  ["image/heic", "heif"],
  ["image/heif", "heif"],
]);

const SUPPORTED_FORMATS = new Set(MIME_TO_FORMAT.values());

export class ImageValidationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "ImageValidationError";
    this.code = "INVALID_IMAGE";
    this.statusCode = statusCode;
  }
}

export const isSupportedImageMimeType = (mimeType) =>
  MIME_TO_FORMAT.has(String(mimeType || "").toLowerCase());

const getImageMetadata = async (buffer) => {
  try {
    return await sharp(buffer, {
      animated: true,
      failOn: "error",
      limitInputPixels: MAX_IMAGE_PIXELS,
    }).metadata();
  } catch {
    throw new ImageValidationError(
      "The uploaded file is not a valid supported image."
    );
  }
};

export const validateImageBuffer = async (buffer, declaredMimeType) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new ImageValidationError("The uploaded image is empty.");
  }

  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new ImageValidationError(
      `Images must be ${MAX_IMAGE_BYTES / (1024 * 1024)}MB or smaller.`,
      413
    );
  }

  const metadata = await getImageMetadata(buffer);
  const format = String(metadata.format || "").toLowerCase();
  const expectedFormat = MIME_TO_FORMAT.get(
    String(declaredMimeType || "").toLowerCase()
  );

  if (!SUPPORTED_FORMATS.has(format) || !metadata.width || !metadata.height) {
    throw new ImageValidationError(
      "The uploaded file is not a supported image format."
    );
  }

  if (expectedFormat && expectedFormat !== format) {
    throw new ImageValidationError(
      "The uploaded file type does not match its contents."
    );
  }

  return metadata;
};

export const validateImageFile = async (file) => {
  if (!file || !isSupportedImageMimeType(file.mimetype)) {
    throw new ImageValidationError(
      "Only supported JPEG, PNG, WebP, GIF, AVIF, TIFF, HEIF, and SVG images are allowed."
    );
  }

  return validateImageBuffer(file.buffer, file.mimetype);
};

export const convertImageToWebp = async (buffer) => {
  await validateImageBuffer(buffer);

  try {
    return await sharp(buffer, {
      animated: true,
      failOn: "error",
      limitInputPixels: MAX_IMAGE_PIXELS,
    })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
  } catch {
    throw new ImageValidationError("The uploaded image could not be converted to WebP.");
  }
};
