import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function portalSessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token: string | undefined = req.cookies?.["portal_session"];
  if (token && process.env.JWT_SECRET) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: "portal" });
      (req as any).portalUser = payload;
    } catch {
      // cookie inválida o expirada — continúa sin portalUser
    }
  }
  next();
}

export function requirePortalSession(req: Request, res: Response, next: NextFunction): void {
  if (!(req as any).portalUser) {
    res.status(401).json({ ok: false, message: "No autenticado." });
    return;
  }
  next();
}
