import { Router } from "express";
import { ComplaintController } from "../controllers/complaint.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createComplaintValidator,
  updateStatusValidator,
  feedbackValidator,
} from "../validators/complaint.validator";

const router = Router();

// Public
router.get("/categories", ComplaintController.getCategories);

// Citizen routes
router.post(
  "/",
  authenticate,
  authorize("CITIZEN"),
  createComplaintValidator,
  validate,
  ComplaintController.create
);

router.get(
  "/my",
  authenticate,
  authorize("CITIZEN"),
  ComplaintController.getMyComplaints
);

router.post(
  "/:id/feedback",
  authenticate,
  authorize("CITIZEN"),
  feedbackValidator,
  validate,
  ComplaintController.submitFeedback
);

// Shared (any authenticated user)
router.get("/:id", authenticate, ComplaintController.getById);

// Official / Admin routes
router.get(
  "/",
  authenticate,
  authorize("OFFICIAL", "ADMIN"),
  ComplaintController.getAll
);

router.put(
  "/:id/status",
  authenticate,
  authorize("OFFICIAL", "ADMIN"),
  updateStatusValidator,
  validate,
  ComplaintController.updateStatus
);

router.get(
  "/department/:departmentId",
  authenticate,
  authorize("OFFICIAL", "ADMIN"),
  ComplaintController.getByDepartment
);

export default router;
