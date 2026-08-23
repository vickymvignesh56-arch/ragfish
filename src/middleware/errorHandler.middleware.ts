import type { Request, Response, NextFunction } from "express";
import {
  HttpError,
  Middleware,
  type ExpressErrorMiddlewareInterface,
} from "routing-controllers";

@Middleware({ type: "after" })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, _req: Request, res: Response, _next: NextFunction): void {
    if (error instanceof HttpError) {
      if (error.httpCode === 400) {
        res.status(400).json({
          success: 0,
          message: error.message || "Bad Request",
          stack: error.stack,
        });
        return;
      }

      if (error.httpCode === 401) {
        res.status(401).json({
          success: 0,
          message: "Unauthorized",
          stack: error.stack,
        });
        return;
      }

      if (error.httpCode === 403) {
        res.status(403).json({
          success: 0,
          message: error.message || "Forbidden",
          stack: error.stack,
        });
        return;
      }

      if (error.httpCode === 404) {
        res.status(404).json({
          success: 0,
          message: error.message || "Not Found",
          stack: error.stack,
        });
        return;
      }

      res.status(error.httpCode).json({
        success: 0,
        message: error.message,
        stack: error.stack,
      });
      return;
    }

    if (error instanceof Error) {
      res.status(500).json({
        success: 0,
        message: error.message,
        stack: error.stack,
      });
      return;
    }

    res.status(500).json({
      success: 0,
      message: "Internal Server Error",
      stack: error.stack,
    });
  }
}
