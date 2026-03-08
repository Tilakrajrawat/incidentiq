import { Router } from "express";
import {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  getIncidentSummary,
  emitIncidentEvent,
  uploadAttachment,
  getAttachments,
  downloadAttachment
} from "../controllers/recordController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  validateIncidentCreate,
  validateIncidentUpdate,
  validateIncidentQuery,
  validateIncidentIdParam,
  validateAttachmentUpload,
  validateAttachmentDownload
} from "../middleware/validate.js";

const router = Router();
router.post("/events", emitIncidentEvent);
router.use(authMiddleware);

router.get("/analytics/summary", requireRole("admin"), getIncidentSummary);
router.get("/", validateIncidentQuery, getRecords);
router.post("/", validateIncidentCreate, createRecord);
router.get("/:id", validateIncidentIdParam, getRecordById);
router.put("/:id", validateIncidentUpdate, updateRecord);
router.post("/:id/attachments", validateAttachmentUpload, uploadAttachment);
router.get("/:id/attachments", validateIncidentIdParam, getAttachments);
router.get("/:id/attachments/:fileName", validateAttachmentDownload, downloadAttachment);
router.delete("/:id", validateIncidentIdParam, requireRole("admin"), deleteRecord);

export default router;
