import Profile from "./public.model.js";
import Admin from "../admin/admin.model.js";

const defaultProfile = {
  name: "Rumman Ahmed",
  role: "Creative Developer",
  headline: "Building digital products with motion, clarity and character.",
  shortBio:
    "Frontend-focused developer crafting immersive, responsive portfolio experiences and clean product interfaces.",
  about:
    "I combine clean frontend architecture with visual systems that feel intentional: generous spacing, sharp hierarchy, fluid interactions, and sections that guide visitors through the work.",
  location: "India",
  socialLinks: [],
  stats: [
    { value: "15+", label: "Projects" },
    { value: "03", label: "Core stacks" },
    { value: "100%", label: "Responsive" },
  ],
  isAvailable: true,
};

export const getProfile = async () => {
  let profile = await Profile.findOne().lean();

  if (!profile) {
    profile = await Profile.create(defaultProfile);
    profile = profile.toObject();
  }

  // Fetch admin bio
  const admin = await Admin.findOne().select("bio name title").lean();
  if (admin) {
    profile.adminBio = admin.bio;
  }

  return profile;
};

export const updateProfile = async (payload) => {
  const profile = await Profile.findOneAndUpdate({}, payload, {
    new: true,
    runValidators: true,
    upsert: true,
    setDefaultsOnInsert: true,
  }).lean();

  return profile;
};
