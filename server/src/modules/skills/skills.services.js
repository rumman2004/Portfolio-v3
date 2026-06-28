import Skill from "./skills.model.js";

export const getSkills = async ({ admin = false } = {}) => {
  const filter = admin ? {} : { isPublished: true };
  return Skill.find(filter).sort({ order: 1, name: 1 }).lean();
};

export const getFeaturedSkills = async () =>
  Skill.find({ isFeatured: true, isPublished: true }).sort({ order: 1, name: 1 }).lean();

export const createSkill = async (payload) => Skill.create(payload);

export const updateSkill = async (id, payload) => {
  const skill = await Skill.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!skill) {
    const error = new Error("Skill not found");
    error.statusCode = 404;
    throw error;
  }

  return skill;
};

export const deleteSkill = async (id) => {
  const skill = await Skill.findByIdAndDelete(id).lean();

  if (!skill) {
    const error = new Error("Skill not found");
    error.statusCode = 404;
    throw error;
  }

  return skill;
};
