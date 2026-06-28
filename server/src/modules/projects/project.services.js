import slugify from "slugify";
import Project from "./project.model.js";

const ensureSlug = (payload) => {
  if (payload.slug || !payload.title) {
    return payload;
  }

  return {
    ...payload,
    slug: slugify(payload.title, { lower: true, strict: true }),
  };
};

export const getProjects = async ({ admin = false } = {}) => {
  const filter = admin ? {} : { isPublished: true };

  return Project.find(filter).sort({ order: 1, createdAt: -1 }).lean();
};

export const getFeaturedProjects = async () =>
  Project.find({ featured: true, isPublished: true }).sort({ order: 1, createdAt: -1 }).lean();

export const getProjectBySlug = async (slug, { admin = false } = {}) => {
  const filter = admin ? { slug } : { slug, isPublished: true };
  const project = await Project.findOne(filter).lean();

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  return project;
};

export const createProject = async (payload) => Project.create(ensureSlug(payload));

export const updateProject = async (id, payload) => {
  const project = await Project.findByIdAndUpdate(id, ensureSlug(payload), {
    returnDocument: 'after',
    runValidators: true,
  }).lean();

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  return project;
};

export const deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id).lean();

  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  return project;
};
