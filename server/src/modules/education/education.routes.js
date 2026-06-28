import { Router } from "express";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import {
  addEducation,
  editEducation,
  getEducation,
  listAdminEducations,
  listEducations,
  removeEducation,
} from "./education.controller.js";

const router = Router();

router.get("/", listEducations);
router.get("/admin/all", protectAdmin, listAdminEducations);
router.get("/:id", getEducation);
router.post("/", protectAdmin, addEducation);
router.patch("/:id", protectAdmin, editEducation);
router.delete("/:id", protectAdmin, removeEducation);

export default router;
