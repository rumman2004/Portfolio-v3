import {
  createSkill,
  deleteSkill,
  getFeaturedSkills,
  getSkills,
  updateSkill,
} from "./skills.services.js";

export const listSkills = async (req, res, next) => {
  try {
    const skills = await getSkills();

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminSkills = async (req, res, next) => {
  try {
    const skills = await getSkills({ admin: true });

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const listFeaturedSkills = async (req, res, next) => {
  try {
    const skills = await getFeaturedSkills();

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const addSkill = async (req, res, next) => {
  try {
    const skill = await createSkill(req.body);

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

export const editSkill = async (req, res, next) => {
  try {
    const skill = await updateSkill(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const removeSkill = async (req, res, next) => {
  try {
    await deleteSkill(req.params.id);

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};
