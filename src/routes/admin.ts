import { Router } from "express";
import { admin } from "../middlewares/auth";
const r = Router();
r.get("/status", admin, async (_req, res) => {
  res.json({ success: true });
});
export default r;