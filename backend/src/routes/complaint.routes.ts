import { Router } from "express";
import { ComplaintController } from "../controllers/complaint.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createComplaintValidator,
  updateStatusValidator,
  feedbackValidator,
} from "../validators/complaint.validator";
import { auditLog } from "../middleware/auditLog";

const router = Router();

// Public
router.get("/categories", ComplaintController.getCategories);
router.get("/map", ComplaintController.getMapData);

// Citizen routes
router.post(
  "/",
  authenticate,
  authorize("CITIZEN"),
  createComplaintValidator,
  validate,
  auditLog("CREATE_COMPLAINT"),
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
  auditLog("UPDATE_STATUS"),
  ComplaintController.updateStatus
);

router.get(
  "/department/:departmentId",
  authenticate,
  authorize("OFFICIAL", "ADMIN"),
  ComplaintController.getByDepartment
);

export default router;
