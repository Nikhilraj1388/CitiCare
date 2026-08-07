import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize("ADMIN"));

router.get("/stats", AdminController.getDashboardStats);
router.get("/users", AdminController.getUsers);
router.put("/users/:id/toggle-status", AdminController.toggleUserStatus);
router.put("/users/:id/role", AdminController.changeUserRole);
router.get("/departments", AdminController.getDepartments);
router.post("/departments/assign", AdminController.assignUserToDepartment);

export default router;
