import Experience from "./experience.model.js";

export const getExperiences = async ({ admin = false } = {}) => {
  const filter = admin ? {} : { isPublished: true };
  return Experience.find(filter).sort({ order: 1, startDate: -1 }).lean();
};

export const getExperienceById = async (id, { admin = false } = {}) => {
  const filter = admin ? { _id: id } : { _id: id, isPublished: true };
  const experience = await Experience.findOne(filter).lean();

  if (!experience) {
    const error = new Error("Experience not found");
    error.statusCode = 404;
    throw error;
  }

  return experience;
};

export const createExperience = async (payload) => Experience.create(payload);

export const updateExperience = async (id, payload) => {
  const experience = await Experience.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!experience) {
    const error = new Error("Experience not found");
    error.statusCode = 404;
    throw error;
  }

  return experience;
};

export const deleteExperience = async (id) => {
  const experience = await Experience.findByIdAndDelete(id).lean();

  if (!experience) {
    const error = new Error("Experience not found");
    error.statusCode = 404;
    throw error;
  }

  return experience;
};
