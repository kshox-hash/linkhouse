import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function portalSessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!process.env.GOOGLE_CLIENT_ID) { next(); return; }

  const token: string | undefined = req.cookies?.["portal_session"];
  if (!token) {
    res.status(401).json({ ok: false, message: "No autenticado." });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, { issuer: "portal" });
    (req as any).portalUser = payload;
    next();
  } catch {
    res.status(401).json({ ok: false, message: "Sesión expirada." });
  }
}
