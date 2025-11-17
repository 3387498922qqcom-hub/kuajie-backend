import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middlewares/auth";
const prisma = new PrismaClient();
const r = Router();
r.get("/", auth, async (req, res) => {
  const u = (req as any).user;
  const items = await prisma.cartItem.findMany({ where: { userId: u.userId }, include: { product: true } });
  res.json({ success: true, data: items });
});
r.post("/add", auth, async (req, res) => {
  const u = (req as any).user;
  const { productId, quantity } = req.body;
  const item = await prisma.cartItem.create({ data: { userId: u.userId, productId, quantity } });
  res.json({ success: true, data: item });
});
r.delete("/remove/:id", auth, async (req, res) => {
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});
export default r;