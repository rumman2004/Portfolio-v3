import slugify from "slugify";
import Certificate from "./certificate.model.js";

const ensureSlug = (payload) => {
  if (payload.slug || !payload.title) {
    return payload;
  }

  return {
    ...payload,
    slug: slugify(`${payload.title} ${payload.issuer || ""}`, { lower: true, strict: true }),
  };
};

export const getCertificates = async ({ admin = false } = {}) => {
  const filter = admin ? {} : { isPublished: true };
  return Certificate.find(filter).sort({ order: 1, issuedAt: -1, createdAt: -1 }).lean();
};

export const getCertificateBySlug = async (slug, { admin = false } = {}) => {
  const filter = admin ? { slug } : { slug, isPublished: true };
  const certificate = await Certificate.findOne(filter).lean();

  if (!certificate) {
    const error = new Error("Certificate not found");
    error.statusCode = 404;
    throw error;
  }

  return certificate;
};

export const createCertificate = async (payload) => Certificate.create(ensureSlug(payload));

export const updateCertificate = async (id, payload) => {
  const certificate = await Certificate.findByIdAndUpdate(id, ensureSlug(payload), {
    new: true,
    runValidators: true,
  }).lean();

  if (!certificate) {
    const error = new Error("Certificate not found");
    error.statusCode = 404;
    throw error;
  }

  return certificate;
};

export const deleteCertificate = async (id) => {
  const certificate = await Certificate.findByIdAndDelete(id).lean();

  if (!certificate) {
    const error = new Error("Certificate not found");
    error.statusCode = 404;
    throw error;
  }

  return certificate;
};
