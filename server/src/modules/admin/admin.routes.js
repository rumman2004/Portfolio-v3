import { Router } from "express";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import { login, logout, me, getDashboardStats, updateProfile } from "./admin.controller.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectAdmin, me);
router.put("/profile", protectAdmin, updateProfile);
router.get("/dashboard-stats", protectAdmin, getDashboardStats);

export default router;
