import { Router, Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";
import { authenticate } from "../middleware/auth";
import { sendSuccess } from "../utils/apiResponse";

const router = Router();

// All notification routes require authentication
router.use(authenticate);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await NotificationService.getByUser(req.user!.id, page, limit);
    sendSuccess(res, "Notifications retrieved", result);
  } catch (error) { next(error); }
});

router.put("/:id/read", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationService.markAsRead(req.params.id as string, req.user!.id);
    sendSuccess(res, "Notification marked as read");
  } catch (error) { next(error); }
});

router.put("/read-all", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await NotificationService.markAllAsRead(req.user!.id);
    sendSuccess(res, "All notifications marked as read");
  } catch (error) { next(error); }
});

export default router;
