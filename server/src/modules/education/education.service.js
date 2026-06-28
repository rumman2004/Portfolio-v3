import Education from "./education.model.js";

export const getEducations = async ({ admin = false } = {}) => {
  const filter = admin ? {} : { isPublished: true };
  return Education.find(filter).sort({ order: 1, startDate: -1 }).lean();
};

export const getEducationById = async (id, { admin = false } = {}) => {
  const filter = admin ? { _id: id } : { _id: id, isPublished: true };
  const education = await Education.findOne(filter).lean();

  if (!education) {
    const error = new Error("Education not found");
    error.statusCode = 404;
    throw error;
  }

  return education;
};

export const createEducation = async (payload) => Education.create(payload);

export const updateEducation = async (id, payload) => {
  const education = await Education.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!education) {
    const error = new Error("Education not found");
    error.statusCode = 404;
    throw error;
  }

  return education;
};

export const deleteEducation = async (id) => {
  const education = await Education.findByIdAndDelete(id).lean();

  if (!education) {
    const error = new Error("Education not found");
    error.statusCode = 404;
    throw error;
  }

  return education;
};
