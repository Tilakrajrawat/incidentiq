import { body, query, param, validationResult } from "express-validator";

const severityValues = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const statusValues = ["open", "acknowledged", "in_progress", "resolved", "closed"];
const roleValues = ["reporter", "responder", "admin"];

const handleValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

export const validateRegister = [
  body("name").isString().trim().isLength({ min: 2 }).withMessage("name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("email must be valid"),
  body("password").isLength({ min: 6 }).withMessage("password must be at least 6 characters"),
  body("role").isIn(roleValues).withMessage("role must be one of reporter, responder, admin"),
  handleValidationResult
];

export const validateIncidentCreate = [
  body("title").isString().trim().isLength({ min: 3, max: 100 }).withMessage("title must be 3-100 characters"),
  body("description")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ min: 10 })
    .withMessage("description must be at least 10 characters"),
  body("content")
    .optional({ values: "falsy" })
    .isString()
    .isLength({ min: 10 })
    .withMessage("content must be at least 10 characters when provided"),
  body("severity")
    .isString()
    .customSanitizer((value) => value?.toUpperCase())
    .isIn(severityValues)
    .withMessage("severity must be one of CRITICAL, HIGH, MEDIUM, LOW"),
  body("assignedTo").optional({ values: "falsy" }).isMongoId().withMessage("assignedTo must be a valid user id"),
  body("tags").optional().isArray().withMessage("tags must be an array"),
  body("tags.*").optional().isString().withMessage("each tag must be a string"),
  (req, res, next) => {
    const errors = validationResult(req).array();

    if (!req.body.description && !req.body.content) {
      errors.push({ msg: "description is required", path: "description", location: "body" });
    }

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    return next();
  }
];

export const validateIncidentUpdate = [
  param("id").isMongoId().withMessage("id must be a valid incident id"),
  body("title").optional().isString().trim().isLength({ min: 3, max: 100 }).withMessage("title must be 3-100 characters"),
  body("description").optional({ values: "falsy" }).isString().isLength({ min: 10 }).withMessage("description must be at least 10 characters"),
  body("content").optional({ values: "falsy" }).isString().isLength({ min: 10 }).withMessage("content must be at least 10 characters"),
  body("severity")
    .optional()
    .isString()
    .customSanitizer((value) => value?.toUpperCase())
    .isIn(severityValues)
    .withMessage("severity must be one of CRITICAL, HIGH, MEDIUM, LOW"),
  body("status").optional().isIn(statusValues).withMessage("status must be one of open, acknowledged, in_progress, resolved, closed"),
  body("assignedTo").optional({ nullable: true }).custom((value) => value === null || /^[a-f\d]{24}$/i.test(value)).withMessage("assignedTo must be null or valid user id"),
  body("metadata").optional().isObject().withMessage("metadata must be an object"),
  body().custom((value) => Object.keys(value || {}).length > 0).withMessage("at least one update field is required"),
  handleValidationResult
];

export const validateIncidentQuery = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be >= 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
  query("severity").optional().isIn(["critical", "high", "medium", "low", "CRITICAL", "HIGH", "MEDIUM", "LOW"]).withMessage("invalid severity filter"),
  query("status").optional().isIn(statusValues).withMessage("invalid status filter"),
  query("assignedTo").optional().custom((value) => value === "unassigned" || /^[a-f\d]{24}$/i.test(value)).withMessage("assignedTo must be user id or unassigned"),
  query("q").optional().isString().isLength({ max: 200 }).withMessage("q must be <= 200 chars"),
  handleValidationResult
];

export const validateIncidentIdParam = [
  param("id").isMongoId().withMessage("id must be a valid incident id"),
  handleValidationResult
];

export const validateAttachmentUpload = [
  param("id").isMongoId().withMessage("id must be a valid incident id"),
  body("fileName").isString().trim().isLength({ min: 1, max: 120 }).withMessage("fileName is required"),
  body("contentBase64").isString().isLength({ min: 1 }).withMessage("contentBase64 is required"),
  handleValidationResult
];

export const validateAttachmentDownload = [
  param("id").isMongoId().withMessage("id must be a valid incident id"),
  param("fileName").isString().trim().isLength({ min: 1, max: 140 }).withMessage("fileName is required"),
  handleValidationResult
];
