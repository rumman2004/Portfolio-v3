import { Router } from "express";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import {
  addSkill,
  editSkill,
  listAdminSkills,
  listFeaturedSkills,
  listSkills,
  removeSkill,
} from "./skills.controller.js";

const router = Router();

router.get("/", listSkills);
router.get("/featured", listFeaturedSkills);
router.get("/admin/all", protectAdmin, listAdminSkills);
router.post("/", protectAdmin, addSkill);
router.patch("/:id", protectAdmin, editSkill);
router.delete("/:id", protectAdmin, removeSkill);

export default router;
