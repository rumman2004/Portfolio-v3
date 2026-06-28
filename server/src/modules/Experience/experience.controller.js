import {
  createExperience,
  deleteExperience,
  getExperienceById,
  getExperiences,
  updateExperience,
} from "./experience.service.js";

export const listExperiences = async (req, res, next) => {
  try {
    const experiences = await getExperiences();

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminExperiences = async (req, res, next) => {
  try {
    const experiences = await getExperiences({ admin: true });

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    next(error);
  }
};

export const getExperience = async (req, res, next) => {
  try {
    const experience = await getExperienceById(req.params.id);

    res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const addExperience = async (req, res, next) => {
  try {
    const experience = await createExperience(req.body);

    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

export const editExperience = async (req, res, next) => {
  try {
    const experience = await updateExperience(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const removeExperience = async (req, res, next) => {
  try {
    await deleteExperience(req.params.id);

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};
