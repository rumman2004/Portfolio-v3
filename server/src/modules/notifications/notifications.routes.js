import express from "express";
import { getRandomNotification } from "./notifications.controller.js";

const router = express.Router();

router.get("/random", getRandomNotification);

export default router;
