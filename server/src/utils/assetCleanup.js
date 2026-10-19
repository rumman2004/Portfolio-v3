import { deleteFromCloudinary } from "../config/cloudinary.js";

export const cleanupCloudinaryUrls = async (
  urls,
  { allowedFolders = [], isReferenced } = {}
) => {
  const uniqueUrls = [
    ...new Set(
      (Array.isArray(urls) ? urls : [urls]).filter(
        (url) => typeof url === "string" && url.trim()
      )
    ),
  ];

  await Promise.all(
    uniqueUrls.map(async (url) => {
      try {
        if (isReferenced && (await isReferenced(url))) {
          return;
        }

        await deleteFromCloudinary(url, { allowedFolders });
      } catch (error) {
        // Cleanup is best effort. The database change has already completed,
        // so a transient Cloudinary failure must not make the API lie about it.
        console.error("Cloudinary cleanup failed:", error.message);
      }
    })
  );
};
