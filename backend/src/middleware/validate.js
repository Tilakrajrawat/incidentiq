import { body, validationResult } from "express-validator";

const severityValues = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const roleValues = ["reporter", "responder", "admin"];

export const validateRegister = [
  body("name").isString().trim().isLength({ min: 2 }).withMessage("name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("email must be valid"),
  body("password").isLength({ min: 6 }).withMessage("password must be at least 6 characters"),
  body("role").isIn(roleValues).withMessage("role must be one of reporter, responder, admin"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return next();
  }
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
