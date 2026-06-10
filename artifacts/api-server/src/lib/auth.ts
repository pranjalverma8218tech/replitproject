import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET ?? "rd-dev-secret-change-in-production";
const JWT_EXPIRES = process.env.JWT_EXPIRES ?? "24h";

export interface AdminTokenPayload {
  id: number;
  email: string;
  username: string;
  role: string;
}

export function signToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES } as jwt.SignOptions);
}

export function verifyToken(token: string): AdminTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "No token provided." });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = verifyToken(token);
    (req as Request & { admin: AdminTokenPayload }).admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid or expired token." });
  }
}
