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
          success: false,
          statusCode: 400,
          message: error.message || "Bad Request",
        });
        return;
      }

      if (error.httpCode === 401) {
        res.status(401).json({
          success: false,
          statusCode: 401,
          message: error.message || "Unauthorized",
        });
        return;
      }

      if (error.httpCode === 403) {
        res.status(403).json({
          success: false,
          statusCode: 403,
          message: error.message || "Forbidden",
        });
        return;
      }

      if (error.httpCode === 404) {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: error.message || "Not Found",
        });
        return;
      }

      res.status(error.httpCode).json({
        success: false,
        statusCode: error.httpCode,
        message: error.message,
      });
      return;
    }

    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
    });
  }
}
