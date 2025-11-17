import { Router } from "express";
import { auth } from "../middlewares/auth";
const r = Router();
r.post("/create", auth, async (_req, res) => {
  res.json({ success: true, data: { method: "wechat", qr: "placeholder" } });
});
r.post("/callback/wechat", async (_req, res) => {
  res.json({ success: true });
});
r.post("/callback/alipay", async (_req, res) => {
  res.json({ success: true });
});
export default r;