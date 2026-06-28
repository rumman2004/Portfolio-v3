import { Router } from "express";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import {
  addExperience,
  editExperience,
  getExperience,
  listAdminExperiences,
  listExperiences,
  removeExperience,
} from "./experience.controller.js";

const router = Router();

router.get("/", listExperiences);
router.get("/admin/all", protectAdmin, listAdminExperiences);
router.get("/:id", getExperience);
router.post("/", protectAdmin, addExperience);
router.patch("/:id", protectAdmin, editExperience);
router.delete("/:id", protectAdmin, removeExperience);

export default router;
