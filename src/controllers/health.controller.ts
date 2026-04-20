import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db.js";

export const getHealth = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "success",
      message: "Health Check OK",
      timestamp: new Date().toISOString(),
      services: {
        api: "online",
        database: "online",
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: "Health Check Failed",
      timestamp: new Date().toISOString(),
      services: {
        api: "online",
        database: "offline",
      },
      error: process.env.NODE_ENV !== "production" ? error : undefined,
    });
  }
};
