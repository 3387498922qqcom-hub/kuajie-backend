import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";
export function auth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : "";
  const p = t ? verifyJwt(t) : null;
  if (!p) return res.status(401).json({ success: false, message: "unauthorized" });
  (req as any).user = p;
  next();
}
export function admin(req: Request, res: Response, next: NextFunction) {
  const u = (req as any).user;
  if (!u || u.role !== "ADMIN") return res.status(403).json({ success: false, message: "forbidden" });
  next();
}