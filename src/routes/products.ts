import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const r = Router();
r.get("/", async (_req, res) => {
  const list = await prisma.product.findMany({ where: { active: true } });
  res.json({ success: true, data: list });
});
r.post("/", async (req, res) => {
  const { sku, name, price } = req.body;
  const p = await prisma.product.create({ data: { sku, name, price } });
  res.json({ success: true, data: p });
});
export default r;