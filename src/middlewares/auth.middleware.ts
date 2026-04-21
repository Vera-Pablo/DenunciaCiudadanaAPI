import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id_user: number;
  role: string;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ status: "error", message: "Unauthorized: Token missing" });
  }

  const secret = process.env.JWT_SECRET || "default_secret_key_change_me_in_env";

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ status: "error", message: "Forbidden: Invalid or expired token" });
    }

    req.user = user as TokenPayload;
    next();
  });
};
