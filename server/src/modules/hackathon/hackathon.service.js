import slugify from "slugify";
import Hackathon from "./hackathon.model.js";
import Project from "../projects/project.model.js";

const sanitizePayload = (payload) => {
  const cleaned = { ...payload };
  // Empty string can't be cast to ObjectId — remove it so Mongoose doesn't choke
  if (cleaned.projectId === '' || cleaned.projectId === undefined) {
    cleaned.projectId = null;
  }
  return cleaned;
};

const ensureSlug = (payload) => {
  if (payload.slug || !payload.title) {
    return sanitizePayload(payload);
  }

  return sanitizePayload({
    ...payload,
    slug: slugify(payload.title, { lower: true, strict: true }),
  });
};

export const getHackathons = async ({ admin = false } = {}) => {
  const filter = admin ? {} : { isPublished: true };
  return Hackathon.find(filter).populate("projectId").sort({ order: 1, date: -1 }).lean();
};

export const getFeaturedHackathons = async () =>
  Hackathon.find({ isFeatured: true, isPublished: true }).populate("projectId").sort({ order: 1, date: -1 }).lean();

export const getHackathonBySlug = async (slug, { admin = false } = {}) => {
  const filter = admin ? { slug } : { slug, isPublished: true };
  const hackathon = await Hackathon.findOne(filter).populate("projectId").lean();

  if (!hackathon) {
    const error = new Error("Hackathon not found");
    error.statusCode = 404;
    throw error;
  }

  return hackathon;
};

export const createHackathon = async (payload) => Hackathon.create(ensureSlug(payload));

export const updateHackathon = async (id, payload) => {
  const hackathon = await Hackathon.findByIdAndUpdate(id, ensureSlug(payload), {
    new: true,
    runValidators: true,
  }).lean();

  if (!hackathon) {
    const error = new Error("Hackathon not found");
    error.statusCode = 404;
    throw error;
  }

  return hackathon;
};

export const deleteHackathon = async (id) => {
  const hackathon = await Hackathon.findByIdAndDelete(id).lean();

  if (!hackathon) {
    const error = new Error("Hackathon not found");
    error.statusCode = 404;
    throw error;
  }

  return hackathon;
};

export const getStats = async () => {
  const [hackathons, projectCount] = await Promise.all([
    Hackathon.find({ isPublished: true }).select("achievement").lean(),
    Project.countDocuments({ isPublished: true }),
  ]);

  const totalHackathons = hackathons.length;

  // Count winning positions: achievement contains "1st", "2nd", "3rd", "winner", "won"
  const winPattern = /\b(1st|2nd|3rd|first|second|third|winner|won)\b/i;

  // Count top-10 finishes: achievement contains a rank ≤10, "top 10", "finalist", or any win
  const topTenPattern = /\b(top\s*10|finalist)\b/i;

  let winningPositions = 0;
  let topTenFinishes = 0;

  for (const h of hackathons) {
    const ach = (h.achievement || "").trim();
    if (!ach) continue;

    const isWin = winPattern.test(ach);
    if (isWin) {
      winningPositions++;
      topTenFinishes++; // wins are also top-10
      continue;
    }

    // Check for explicit "top 10" / "finalist"
    if (topTenPattern.test(ach)) {
      topTenFinishes++;
      continue;
    }

    // Try to extract a numeric rank (e.g. "5th", "4th Place")
    const rankMatch = ach.match(/\b(\d+)/);
    if (rankMatch) {
      const rank = parseInt(rankMatch[1], 10);
      if (rank <= 10) topTenFinishes++;
    }
  }

  return { totalHackathons, topTenFinishes, winningPositions, projectCount };
};
