import SocialMedia from "./socialmedia.model.js";

export const getSocialLinks = async ({ admin = false } = {}) => {
  const filter = admin ? {} : { isPublished: true };
  return SocialMedia.find(filter).sort({ order: 1, platform: 1 }).lean();
};

export const createSocialLink = async (payload) => SocialMedia.create(payload);

export const updateSocialLink = async (id, payload) => {
  const link = await SocialMedia.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!link) {
    const error = new Error("Social media link not found");
    error.statusCode = 404;
    throw error;
  }

  return link;
};

export const deleteSocialLink = async (id) => {
  const link = await SocialMedia.findByIdAndDelete(id).lean();

  if (!link) {
    const error = new Error("Social media link not found");
    error.statusCode = 404;
    throw error;
  }

  return link;
};
