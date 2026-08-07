import { body } from "express-validator";

export const createComplaintValidator = [
  body("categoryId").notEmpty().withMessage("Category is required").isUUID().withMessage("Invalid category"),
  body("title").trim().notEmpty().withMessage("Title is required").isLength({ min: 5, max: 200 }).withMessage("Title must be 5-200 characters"),
  body("description").trim().notEmpty().withMessage("Description is required").isLength({ min: 10, max: 2000 }).withMessage("Description must be 10-2000 characters"),
  body("latitude").optional().isDecimal().withMessage("Invalid latitude"),
  body("longitude").optional().isDecimal().withMessage("Invalid longitude"),
  body("address").optional().trim().isLength({ max: 500 }).withMessage("Address too long"),
  body("imageUrls").optional().isArray({ max: 3 }).withMessage("Maximum 3 images allowed"),
];

export const updateStatusValidator = [
  body("status").notEmpty().withMessage("Status is required").isIn(["UNDER_REVIEW", "IN_PROGRESS", "RESOLVED", "REOPENED"]).withMessage("Invalid status"),
  body("remarks").optional().trim().isLength({ max: 1000 }).withMessage("Remarks too long"),
];

export const feedbackValidator = [
  body("rating").notEmpty().withMessage("Rating is required").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
  body("comment").optional().trim().isLength({ max: 1000 }).withMessage("Comment too long"),
];
