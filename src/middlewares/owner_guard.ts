import { Request, Response } from "express";

export function isOwner(req: Request, resourceUserId: string): boolean {
  const authUserId = String(req.user?.userId ?? "").trim();
  return !!authUserId && authUserId === resourceUserId;
}

export function denyIfNotOwner(req: Request, res: Response, resourceUserId: string): boolean {
  if (!isOwner(req, resourceUserId)) {
    res.status(403).json({ ok: false, message: "Sin permisos." });
    return true;
  }
  return false;
}
