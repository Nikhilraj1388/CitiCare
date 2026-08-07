import prisma from "../config/database";
import { Request, Response, NextFunction } from "express";

/**
 * Audit log middleware — records all state-changing API calls
 */
export function auditLog(action: string) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        await prisma.auditLog.create({
          data: {
            userId: req.user.id,
            action,
            module: req.baseUrl.split("/").pop() || "unknown",
            ipAddress: (req.ip || req.socket.remoteAddress || "unknown") as string,
          },
        });
      }
    } catch (error) {
      console.error("Audit log error:", error);
    }
    next();
  };
}
