import {
  createHackathon,
  deleteHackathon,
  getFeaturedHackathons,
  getHackathonBySlug,
  getHackathons,
  getStats,
  updateHackathon,
} from "./hackathon.service.js";
import cloudinary from "../../config/cloudinary.js";

export const listHackathons = async (req, res, next) => {
  try {
    const hackathons = await getHackathons();

    res.status(200).json({
      success: true,
      count: hackathons.length,
      data: hackathons,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminHackathons = async (req, res, next) => {
  try {
    const hackathons = await getHackathons({ admin: true });

    res.status(200).json({
      success: true,
      count: hackathons.length,
      data: hackathons,
    });
  } catch (error) {
    next(error);
  }
};

export const listFeaturedHackathons = async (req, res, next) => {
  try {
    const hackathons = await getFeaturedHackathons();

    res.status(200).json({
      success: true,
      count: hackathons.length,
      data: hackathons,
    });
  } catch (error) {
    next(error);
  }
};

export const getHackathon = async (req, res, next) => {
  try {
    const hackathon = await getHackathonBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      data: hackathon,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const addHackathon = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.image = req.file.path;
    }
    const hackathon = await createHackathon(payload);

    res.status(201).json({
      success: true,
      message: "Hackathon created successfully",
      data: hackathon,
    });
  } catch (error) {
    next(error);
  }
};

export const editHackathon = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.image = req.file.path;
    }
    const hackathon = await updateHackathon(req.params.id, payload);

    res.status(200).json({
      success: true,
      message: "Hackathon updated successfully",
      data: hackathon,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const removeHackathon = async (req, res, next) => {
  try {
    await deleteHackathon(req.params.id);

    res.status(200).json({
      success: true,
      message: "Hackathon deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const getHackathonStats = async (req, res, next) => {
  try {
    const { totalHackathons, topTenFinishes, winningPositions, projectCount } =
      await getStats();

    res.status(200).json({
      success: true,
      data: [
        { value: `${totalHackathons}+`, label: "Hackathons Participated" },
        { value: `${topTenFinishes}`, label: "Top 10 Finishes" },
        { value: `${winningPositions}`, label: "Winning Positions" },
        { value: `${projectCount}+`, label: "Projects Built" },
      ],
    });
  } catch (error) {
    next(error);
  }
};
