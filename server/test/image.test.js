import test from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  MAX_IMAGE_BYTES,
  convertImageToWebp,
  validateImageBuffer,
} from "../src/utils/image.js";

const createPng = () =>
  sharp({
    create: {
      width: 8,
      height: 8,
      channels: 4,
      background: { r: 30, g: 80, b: 140, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

test("converts a valid image buffer to WebP", async () => {
  const png = await createPng();
  const webp = await convertImageToWebp(png);
  const metadata = await sharp(webp).metadata();

  assert.equal(metadata.format, "webp");
});

test("rejects image buffers whose declared MIME type does not match", async () => {
  const png = await createPng();

  await assert.rejects(
    () => validateImageBuffer(png, "image/jpeg"),
    (error) => error.code === "INVALID_IMAGE" && error.statusCode === 400
  );
});

test("rejects buffers above the upload size limit before decoding", async () => {
  const oversized = Buffer.alloc(MAX_IMAGE_BYTES + 1);

  await assert.rejects(
    () => validateImageBuffer(oversized),
    (error) => error.code === "INVALID_IMAGE" && error.statusCode === 413
  );
});
