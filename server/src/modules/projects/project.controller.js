import {
  createProject,
  deleteProject,
  getFeaturedProjects,
  getProjectById,
  getProjectBySlug,
  getProjects,
  updateProject,
} from "./project.services.js";
import Project from "./project.model.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";
import { cleanupCloudinaryUrls } from "../../utils/assetCleanup.js";

const getProjectImageUrls = (project) => [
  project?.heroImage,
  ...(Array.isArray(project?.gallery) ? project.gallery : []),
].filter(Boolean);

const cleanupProjectImages = async (urls, excludedProjectId) => {
  const uniqueUrls = [...new Set(urls.filter(Boolean))];
  if (uniqueUrls.length === 0) return;

  const filter = {
    $or: [
      { heroImage: { $in: uniqueUrls } },
      { gallery: { $in: uniqueUrls } },
    ],
  };

  if (excludedProjectId) {
    filter._id = { $ne: excludedProjectId };
  }

  let references;
  try {
    references = await Project.find(filter).select("heroImage gallery").lean();
  } catch (error) {
    console.error("Project image reference check failed:", error.message);
    return;
  }

  const referencedUrls = new Set(
    references.flatMap((project) => getProjectImageUrls(project))
  );

  await cleanupCloudinaryUrls(uniqueUrls, {
    allowedFolders: ["portfolio/projects"],
    isReferenced: (url) => referencedUrls.has(url),
  });
};

const rethrowInvalidImage = (error) => {
  if (error?.code === "INVALID_IMAGE") {
    throw error;
  }
};

export const listProjects = async (req, res, next) => {
  try {
    const projects = await getProjects();

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminProjects = async (req, res, next) => {
  try {
    const projects = await getProjects({ admin: true });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const listFeaturedProjects = async (req, res, next) => {
  try {
    const projects = await getFeaturedProjects();

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await getProjectBySlug(req.params.slug);
    
    // Increment clicks
    if (project) {
      await Project.updateOne({ _id: project._id }, { $inc: { clicks: 1 } });
      project.clicks = (project.clicks || 0) + 1;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const addProject = async (req, res, next) => {
  const uploadedImageUrls = [];

  try {
    const payload = { ...req.body };
    const uploadWarnings = [];

    // Split techStack comma-separated string into array
    if (typeof payload.techStack === 'string') {
      payload.techStack = payload.techStack.split(',').map(t => t.trim()).filter(Boolean);
    }

    if (req.files && req.files.heroImage) {
      try {
        payload.heroImage = await uploadToCloudinary(
          req.files.heroImage[0].buffer,
          "portfolio/projects"
        );
        uploadedImageUrls.push(payload.heroImage);
      } catch (uploadErr) {
        rethrowInvalidImage(uploadErr);
        console.error("Hero image upload failed:", uploadErr.message);
        uploadWarnings.push("Hero image upload failed: " + (uploadErr.http_code === 403 ? "Cloudinary credentials are invalid. Please check your .env file." : uploadErr.message));
      }
    }

    if (req.files && req.files.gallery) {
      payload.gallery = [];
      for (const file of req.files.gallery) {
        try {
          const imageUrl = await uploadToCloudinary(file.buffer, "portfolio/projects");
          payload.gallery.push(imageUrl);
          uploadedImageUrls.push(imageUrl);
        } catch (uploadErr) {
          rethrowInvalidImage(uploadErr);
          console.error("Gallery upload failed:", uploadErr.message);
          uploadWarnings.push("Gallery upload failed: " + (uploadErr.http_code === 403 ? "Cloudinary credentials are invalid." : uploadErr.message));
        }
      }
    }

    delete payload.removeHeroImage;
    const project = await createProject(payload);

    res.status(201).json({
      success: true,
      message: uploadWarnings.length > 0
        ? "Project created, but image upload failed: " + uploadWarnings.join("; ")
        : "Project created successfully",
      warnings: uploadWarnings,
      data: project,
    });
  } catch (error) {
    await cleanupProjectImages(uploadedImageUrls);
    next(error);
  }
};

export const editProject = async (req, res, next) => {
  const uploadedImageUrls = [];

  try {
    const previousProject = await getProjectById(req.params.id);
    const payload = { ...req.body };
    const uploadWarnings = [];
    const shouldRemoveHeroImage = String(payload.removeHeroImage).toLowerCase() === "true";

    // Split techStack comma-separated string into array
    if (typeof payload.techStack === 'string') {
      payload.techStack = payload.techStack.split(',').map(t => t.trim()).filter(Boolean);
    }

    // Handle hero image upload
    if (req.files && req.files.heroImage) {
      try {
        payload.heroImage = await uploadToCloudinary(
          req.files.heroImage[0].buffer,
          "portfolio/projects"
        );
        uploadedImageUrls.push(payload.heroImage);
      } catch (uploadErr) {
        rethrowInvalidImage(uploadErr);
        console.error("Hero image upload failed:", uploadErr.message);
        uploadWarnings.push("Hero image upload failed: " + (uploadErr.http_code === 403 ? "Cloudinary credentials are invalid. Please check your CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env" : uploadErr.message));
        delete payload.heroImage; // Don't overwrite existing image
      }
    } else if (shouldRemoveHeroImage) {
      payload.heroImage = "";
    } else {
      delete payload.heroImage;
    }

    // Handle existing gallery elements (might be sent as string or array of strings)
    let finalGallery = [];
    if (payload.existingGallery) {
      finalGallery = Array.isArray(payload.existingGallery) ? payload.existingGallery : [payload.existingGallery];
    }
    
    if (req.files && req.files.gallery) {
      for (const file of req.files.gallery) {
        try {
          const imageUrl = await uploadToCloudinary(file.buffer, "portfolio/projects");
          finalGallery.push(imageUrl);
          uploadedImageUrls.push(imageUrl);
        } catch (uploadErr) {
          rethrowInvalidImage(uploadErr);
          console.error("Gallery upload failed:", uploadErr.message);
          uploadWarnings.push("Gallery upload failed: " + (uploadErr.http_code === 403 ? "Cloudinary credentials are invalid." : uploadErr.message));
        }
      }
    }

    // Only update gallery if we processed it
    if (payload.existingGallery !== undefined || (req.files && req.files.gallery)) {
      payload.gallery = finalGallery;
    }

    // Clean up fields that shouldn't be passed to Mongoose
    delete payload.existingGallery;
    delete payload.removeHeroImage;

    const project = await updateProject(req.params.id, payload);

    const previousImageUrls = getProjectImageUrls(previousProject);
    const currentImageUrls = new Set(getProjectImageUrls(project));
    await cleanupProjectImages(
      previousImageUrls.filter((url) => !currentImageUrls.has(url)),
      project._id
    );

    res.status(200).json({
      success: true,
      message: uploadWarnings.length > 0
        ? "Project saved, but image upload failed: " + uploadWarnings.join("; ")
        : "Project updated successfully",
      warnings: uploadWarnings,
      data: project,
    });
  } catch (error) {
    await cleanupProjectImages(uploadedImageUrls);
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const removeProject = async (req, res, next) => {
  try {
    const project = await deleteProject(req.params.id);
    await cleanupProjectImages(getProjectImageUrls(project));

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};
