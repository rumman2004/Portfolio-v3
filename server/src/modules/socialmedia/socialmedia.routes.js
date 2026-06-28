import { Router } from "express";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import {
  addSocialLink,
  editSocialLink,
  listAdminSocialLinks,
  listSocialLinks,
  removeSocialLink,
} from "./socialmedia.controller.js";

const router = Router();

router.get("/", listSocialLinks);
router.get("/admin/all", protectAdmin, listAdminSocialLinks);
router.post("/", protectAdmin, addSocialLink);
router.patch("/:id", protectAdmin, editSocialLink);
router.delete("/:id", protectAdmin, removeSocialLink);

export default router;
