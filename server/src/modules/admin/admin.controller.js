import mongoose from "mongoose";
import { isProduction } from "../../config/env.js";
import { getAdminProfile, loginAdmin, updateAdminProfile } from "./admin.services.js";
import Project from "../projects/project.model.js";
import Certificate from "../certificates/certificate.model.js";
import Contact from "../contact/contact.model.js";
import SocialMedia from "../socialmedia/socialmedia.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = async (req, res, next) => {
  try {
    const result = await loginAdmin(req.body);

    res.cookie("adminToken", result.token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500);
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie("adminToken", cookieOptions);
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const me = (req, res) => {
  res.status(200).json({
    success: true,
    data: getAdminProfile(req.admin),
  });
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      projectsCount,
      certificatesCount,
      messagesCount,
      socialMediaCount,
      recentMessages,
      projectChartData
    ] = await Promise.all([
      Project.countDocuments(),
      Certificate.countDocuments(),
      Contact.countDocuments(),
      SocialMedia.countDocuments(),
      Contact.find().sort({ createdAt: -1 }).limit(5).select('name email subject message createdAt'),
      Project.find().sort({ clicks: -1 }).limit(7).select('title clicks')
    ]);

    // Aggregate total views
    const totalViewsAgg = await Project.aggregate([
      { $group: { _id: null, total: { $sum: "$clicks" } } }
    ]);
    const totalViews = totalViewsAgg.length > 0 ? totalViewsAgg[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        projects: projectsCount,
        certificates: certificatesCount,
        messages: messagesCount,
        views: totalViews,
        socialMedia: socialMediaCount,
        dbConnection: mongoose.connection.readyState,
        apiCalls: req.app.locals.apiCallCount || 0,
        recentMessages,
        projectChartData
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updatedAdmin = await updateAdminProfile(req.admin._id, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedAdmin,
    });
  } catch (error) {
    next(error);
  }
};
