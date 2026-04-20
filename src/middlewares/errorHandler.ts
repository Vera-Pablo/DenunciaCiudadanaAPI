import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(`[Error] ${err.message}`);

  // Default
  let statusCode = err.statusCode || 500;
  let message =
    process.env.NODE_ENV !== "production"
      ? err.message
      : "Internal Server Error";
  let details: any = undefined;

  // Zod errors
  if (err instanceof z.ZodError) {
    statusCode = 400;
    message = "Validation Error";
    details = err.issues;
  }

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    statusCode = 400;
    message = "Database Request Error";
  }

  res.status(statusCode).json({
    status: "error",
    message,
    ...(details && { details }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
