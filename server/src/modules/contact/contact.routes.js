import { Router } from "express";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import {
  editMessageStatus,
  listMessages,
  removeMessage,
  submitContact,
} from "./contact.controller.js";

const router = Router();

router.post("/", submitContact);
router.get("/messages", protectAdmin, listMessages);
router.patch("/messages/:id", protectAdmin, editMessageStatus);
router.delete("/messages/:id", protectAdmin, removeMessage);

export default router;
