import {
  createSocialLink,
  deleteSocialLink,
  getSocialLinks,
  updateSocialLink,
} from "./socialmedia.services.js";

export const listSocialLinks = async (req, res, next) => {
  try {
    const links = await getSocialLinks();

    res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminSocialLinks = async (req, res, next) => {
  try {
    const links = await getSocialLinks({ admin: true });

    res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    });
  } catch (error) {
    next(error);
  }
};

export const addSocialLink = async (req, res, next) => {
  try {
    const link = await createSocialLink(req.body);

    res.status(201).json({
      success: true,
      message: "Social media link created successfully",
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

export const editSocialLink = async (req, res, next) => {
  try {
    const link = await updateSocialLink(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Social media link updated successfully",
      data: link,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const removeSocialLink = async (req, res, next) => {
  try {
    await deleteSocialLink(req.params.id);

    res.status(200).json({
      success: true,
      message: "Social media link deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};
