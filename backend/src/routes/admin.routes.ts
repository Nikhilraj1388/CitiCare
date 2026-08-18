import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// Stats accessible by both OFFICIAL and ADMIN
router.get("/stats", authenticate, authorize("OFFICIAL", "ADMIN"), AdminController.getDashboardStats);

// All other admin routes require ADMIN role
router.use(authenticate, authorize("ADMIN"));
router.get("/users", AdminController.getUsers);
router.post("/users", AdminController.createUser);
router.put("/users/:id/toggle-status", AdminController.toggleUserStatus);
router.put("/users/:id/role", AdminController.changeUserRole);
router.get("/departments", AdminController.getDepartments);
router.post("/departments/assign", AdminController.assignUserToDepartment);
router.delete("/departments/assign", AdminController.removeUserFromDepartment);
router.get("/users/:id/departments", AdminController.getUserDepartments);

export default router;
