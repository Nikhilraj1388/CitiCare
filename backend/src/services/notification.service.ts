import prisma from "../config/database";

export class NotificationService {
  /** Create an in-app notification */
  static async create(data: {
    userId: string;
    title: string;
    message: string;
    type: "SUCCESS" | "INFO" | "WARNING" | "ERROR";
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
      },
    });
  }

  /** Get notifications for a user */
  static async getByUser(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return {
      notifications,
      unreadCount,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /** Mark a notification as read */
  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  /** Mark all as read */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /** Notify citizen on complaint creation */
  static async notifyComplaintCreated(userId: string, complaintNumber: string) {
    return this.create({
      userId,
      title: "Complaint Submitted",
      message: `Your complaint ${complaintNumber} has been submitted and assigned to the relevant department.`,
      type: "SUCCESS",
    });
  }

  /** Notify citizen on status update */
  static async notifyStatusUpdate(userId: string, complaintNumber: string, newStatus: string) {
    return this.create({
      userId,
      title: "Status Updated",
      message: `Complaint ${complaintNumber} status changed to ${newStatus.replace("_", " ")}.`,
      type: "INFO",
    });
  }

  /** Notify citizen on resolution */
  static async notifyResolved(userId: string, complaintNumber: string) {
    return this.create({
      userId,
      title: "Complaint Resolved! 🎉",
      message: `Your complaint ${complaintNumber} has been resolved. Please rate the resolution.`,
      type: "SUCCESS",
    });
  }
}
