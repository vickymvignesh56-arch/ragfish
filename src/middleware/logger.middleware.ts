import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${Date.now() - start} ms`,
      ip: req.ip,
    });
  });
  next();
};
