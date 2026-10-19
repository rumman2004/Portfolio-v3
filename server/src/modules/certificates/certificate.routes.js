import { Router } from "express";
import { protectAdmin } from "../../middleware/authMiddleware.js";
import {
  addCertificate,
  editCertificate,
  getCertificate,
  listAdminCertificates,
  listCertificates,
  removeCertificate,
} from "./certificate.controller.js";
import {
  upload,
  validateUploadedImages,
} from "../../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", listCertificates);
router.get("/admin/all", protectAdmin, listAdminCertificates);
router.get("/:slug", getCertificate);
router.post("/", protectAdmin, upload.single("image"), validateUploadedImages, addCertificate);
router.patch("/:id", protectAdmin, upload.single("image"), validateUploadedImages, editCertificate);
router.delete("/:id", protectAdmin, removeCertificate);

export default router;
