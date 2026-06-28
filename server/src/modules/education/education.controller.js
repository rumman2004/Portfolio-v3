import {
  createEducation,
  deleteEducation,
  getEducationById,
  getEducations,
  updateEducation,
} from "./education.service.js";

export const listEducations = async (req, res, next) => {
  try {
    const educations = await getEducations();

    res.status(200).json({
      success: true,
      count: educations.length,
      data: educations,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminEducations = async (req, res, next) => {
  try {
    const educations = await getEducations({ admin: true });

    res.status(200).json({
      success: true,
      count: educations.length,
      data: educations,
    });
  } catch (error) {
    next(error);
  }
};

export const getEducation = async (req, res, next) => {
  try {
    const education = await getEducationById(req.params.id);

    res.status(200).json({
      success: true,
      data: education,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const addEducation = async (req, res, next) => {
  try {
    const education = await createEducation(req.body);

    res.status(201).json({
      success: true,
      message: "Education created successfully",
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

export const editEducation = async (req, res, next) => {
  try {
    const education = await updateEducation(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Education updated successfully",
      data: education,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const removeEducation = async (req, res, next) => {
  try {
    await deleteEducation(req.params.id);

    res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};
