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
import { validateIncidentCreate } from "../middleware/validate.js";

const router = Router();
router.post("/events", emitIncidentEvent);
router.use(authMiddleware);
router.get("/", getRecords);
router.get("/:id", getRecordById);
router.post("/", validateIncidentCreate, createRecord);
router.put("/:id", updateRecord);
router.post("/:id/attachments", uploadAttachment);
router.get("/:id/attachments", getAttachments);
router.get("/:id/attachments/:fileName", downloadAttachment);
router.delete("/:id", requireRole("admin"), deleteRecord);
router.get("/analytics/summary", requireRole("admin"), getIncidentSummary);

export default router;
