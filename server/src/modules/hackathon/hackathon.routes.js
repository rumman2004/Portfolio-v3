import { Router } from "express";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import { upload } from "../../middleware/uploadMiddleware.js";
import {
  addHackathon,
  editHackathon,
  getHackathon,
  listAdminHackathons,
  listFeaturedHackathons,
  listHackathons,
  removeHackathon,
  getHackathonStats,
} from "./hackathon.controller.js";

const router = Router();

router.get("/", listHackathons);
router.get("/featured", listFeaturedHackathons);
router.get("/admin/all", protectAdmin, listAdminHackathons);
router.get("/stats", getHackathonStats);
router.get("/:slug", getHackathon);
router.post("/", protectAdmin, upload.single("image"), addHackathon);
router.patch("/:id", protectAdmin, upload.single("image"), editHackathon);
router.delete("/:id", protectAdmin, removeHackathon);

export default router;
