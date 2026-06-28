import { Router } from "express";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import { getPublicProfile, updatePublicProfile } from "./public.controller.js";

const router = Router();

router.get("/profile", getPublicProfile);
router.patch("/profile", protectAdmin, updatePublicProfile);

export default router;
