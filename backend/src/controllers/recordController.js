import Record from "../models/Record.js";
import { logger } from "../utils/logger.js";
import { broadcast } from "../websocket/wsServer.js";

const normalizeSeverity = (severity) => severity?.toLowerCase();
const normalizeStatus = (status) => status?.toLowerCase();
const responderProjection = "_id name email role";

const canManageAllIncidents = (role) => role === "admin" || role === "responder";

const enrichRecordQuery = (query) => query.populate("assignedTo", responderProjection).populate("userId", responderProjection);

export const getRecords = async (req, res, next) => {
  try {
    const query = canManageAllIncidents(req.user.role) ? {} : { userId: req.user.id };
    const { severity, status, assignedTo, q } = req.query;
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.max(Number(req.query.limit || 10), 1);
    const skip = (page - 1) * limit;

    if (severity) query.severity = normalizeSeverity(severity);
    if (status) query.status = normalizeStatus(status);
    if (assignedTo === "unassigned") {
      query.assignedTo = null;
    } else if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (q?.trim()) {
      query.$or = [
        { title: { $regex: q.trim(), $options: "i" } },
        { content: { $regex: q.trim(), $options: "i" } }
      ];
    }

    const [incidents, total] = await Promise.all([
      enrichRecordQuery(Record.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)),
      Record.countDocuments(query)
    ]);

    if (req.baseUrl.includes("/api/incidents")) {
      return res.json({
        incidents,
        total,
        page,
        pages: Math.ceil(total / limit) || 1
      });
    }

    return res.json(incidents);
  } catch (err) {
    next(err);
  }
};

export const createRecord = async (req, res, next) => {
  try {
    const { title, content, description, metadata, severity, assignedTo, tags } = req.body;
    const record = await Record.create({
      userId: req.user.id,
      title,
      content: content || description,
      metadata: { ...metadata, tags },
      severity: normalizeSeverity(severity),
      assignedTo
    });

    const hydratedRecord = await enrichRecordQuery(Record.findById(record._id));
    broadcast("incident_created", hydratedRecord);
    logger.trackEvent("record_created", { userId: req.user.id, recordId: record._id.toString() });
    res.status(201).json(hydratedRecord);
  } catch (err) {
    next(err);
  }
};

export const getRecordById = async (req, res, next) => {
  try {
    const query = canManageAllIncidents(req.user.role)
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: req.user.id };

    const incident = await enrichRecordQuery(Record.findOne(query));
    if (!incident) return res.status(404).json({ message: "Record not found" });

    return res.json(incident);
  } catch (error) {
    return next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, description, metadata, severity, status, assignedTo } = req.body;
    const query = canManageAllIncidents(req.user.role) ? { _id: id } : { _id: id, userId: req.user.id };

    const normalizedStatus = normalizeStatus(status);
    const update = {
      title,
      content: content || description,
      metadata,
      severity: normalizeSeverity(severity),
      status: normalizedStatus,
      assignedTo
    };
    Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);
    if (normalizedStatus === "acknowledged") update.acknowledgedAt = new Date();
    if (normalizedStatus === "resolved") update.resolvedAt = new Date();

    const record = await enrichRecordQuery(Record.findOneAndUpdate(query, update, { new: true }));
    if (!record) return res.status(404).json({ message: "Record not found" });

    if (record.status === "resolved") {
      broadcast("incident_resolved", record);
    } else {
      broadcast("incident_updated", record);
    }

    logger.trackEvent("record_updated", { userId: req.user.id, recordId: record._id.toString() });
    res.json(record);
  } catch (err) {
    next(err);
  }
};

export const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = req.user.role === "admin" ? { _id: id } : { _id: id, userId: req.user.id };
    const record = await Record.findOneAndDelete(query);
    if (!record) return res.status(404).json({ message: "Record not found" });
    logger.trackEvent("record_deleted", { userId: req.user.id, recordId: record._id.toString() });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const getIncidentSummary = async (req, res, next) => {
  try {
    const [severitySummary, statusSummary] = await Promise.all([
      Record.aggregate([{ $group: { _id: "$severity", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Record.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }, { $sort: { count: -1 } }])
    ]);

    res.json({ severitySummary, statusSummary });
  } catch (err) {
    next(err);
  }
};

export const emitIncidentEvent = async (req, res) => {
  const key = req.headers["x-realtime-key"];
  if (!process.env.REALTIME_EVENT_KEY || key !== process.env.REALTIME_EVENT_KEY) {
    return res.status(401).json({ message: "Unauthorized realtime event" });
  }

  const { event, data } = req.body || {};
  broadcast(event, data);
  return res.status(202).json({ accepted: true });
};
