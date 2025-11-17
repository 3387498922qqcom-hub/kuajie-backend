import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { signJwt } from "../utils/jwt";
const prisma = new PrismaClient();
const r = Router();
const phoneReq = z.object({ phone: z.string().min(6) });
const phoneVerify = z.object({ phone: z.string(), code: z.string().min(4) });
const registerSchema = z.object({ email: z.string().email(), password: z.string().min(6), inviterId: z.string().optional() });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
r.post("/request-otp", async (req, res) => {
  const p = phoneReq.safeParse(req.body);
  if (!p.success) return res.status(400).json({ success: false });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.oTP.create({ data: { target: p.data.phone, type: "PHONE", code, expiresAt } });
  res.json({ success: true });
});
r.post("/verify-otp", async (req, res) => {
  const v = phoneVerify.safeParse(req.body);
  if (!v.success) return res.status(400).json({ success: false });
  const otp = await prisma.oTP.findFirst({ where: { target: v.data.phone, type: "PHONE" }, orderBy: { createdAt: "desc" } });
  if (!otp || otp.expiresAt < new Date() || otp.code !== v.data.code) return res.status(401).json({ success: false });
  let user = await prisma.user.findUnique({ where: { phone: v.data.phone } });
  if (!user) user = await prisma.user.create({ data: { phone: v.data.phone } });
  await prisma.wallet.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
  const token = signJwt({ userId: user.id, role: user.role });
  res.json({ success: true, token });
});
r.post("/register", async (req, res) => {
  const v = registerSchema.safeParse(req.body);
  if (!v.success) return res.status(400).json({ success: false });
  const exists = await prisma.user.findUnique({ where: { email: v.data.email } });
  if (exists) return res.status(409).json({ success: false });
  const hash = await bcrypt.hash(v.data.password, 10);
  const user = await prisma.user.create({ data: { email: v.data.email, passwordHash: hash, inviterId: v.data.inviterId || null } });
  await prisma.wallet.create({ data: { userId: user.id } });
  const token = signJwt({ userId: user.id, role: user.role });
  res.json({ success: true, token });
});
r.post("/login", async (req, res) => {
  const v = loginSchema.safeParse(req.body);
  if (!v.success) return res.status(400).json({ success: false });
  const user = await prisma.user.findUnique({ where: { email: v.data.email } });
  if (!user || !user.passwordHash) return res.status(401).json({ success: false });
  const ok = await bcrypt.compare(v.data.password, user.passwordHash);
  if (!ok) return res.status(401).json({ success: false });
  const token = signJwt({ userId: user.id, role: user.role });
  res.json({ success: true, token });
});
r.post("/wechat/login", async (_req, res) => {
  res.json({ success: true });
});
export default r;