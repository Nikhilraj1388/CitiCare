import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { sendError } from "../utils/apiResponse";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: "path" in err ? err.path : "unknown",
      message: err.msg,
    }));
    sendError(res, "Validation failed", 422, formatted);
    return;
  }
  next();
};
