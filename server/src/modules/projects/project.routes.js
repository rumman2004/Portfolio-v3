import { Router } from "express";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import {
  addProject,
  editProject,
  getProject,
  listAdminProjects,
  listFeaturedProjects,
  listProjects,
  removeProject,
} from "./project.controller.js";
import { upload } from "../../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", listProjects);
router.get("/featured", listFeaturedProjects);
router.get("/admin/all", protectAdmin, listAdminProjects);
router.get("/:slug", getProject);
router.post("/", protectAdmin, upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'gallery', maxCount: 3 }]), addProject);
router.patch("/:id", protectAdmin, upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'gallery', maxCount: 3 }]), editProject);
router.delete("/:id", protectAdmin, removeProject);

export default router;
