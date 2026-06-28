import { getProfile, updateProfile } from "./public.services.js";

export const getPublicProfile = async (req, res, next) => {
  try {
    const profile = await getProfile();

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePublicProfile = async (req, res, next) => {
  try {
    const profile = await updateProfile(req.body);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
