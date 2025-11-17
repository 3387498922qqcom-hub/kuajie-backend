import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middlewares/auth";
import { computeCommissions } from "../services/commission";
const prisma = new PrismaClient();
const r = Router();
r.get("/", auth, async (req, res) => {
  const u = (req as any).user;
  const list = await prisma.order.findMany({ where: { userId: u.userId }, include: { items: true } });
  res.json({ success: true, data: list });
});
r.post("/create", auth, async (req, res) => {
  const u = (req as any).user;
  const items = await prisma.cartItem.findMany({ where: { userId: u.userId }, include: { product: true } });
  if (!items.length) return res.status(400).json({ success: false });
  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0);
  const { directReferrerId, indirectReferrerId, directCommission, indirectCommission } = await computeCommissions(u.userId, total);
  const order = await prisma.order.create({ data: { userId: u.userId, total, directReferrerId, indirectReferrerId, directCommission, indirectCommission, items: { create: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.product.price })) } } });
  await prisma.cartItem.deleteMany({ where: { userId: u.userId } });
  res.json({ success: true, data: order });
});
r.post("/:id/pay", auth, async (req, res) => {
  const u = (req as any).user;
  const o = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!o || o.userId !== u.userId) return res.status(404).json({ success: false });
  if (o.status !== "PENDING") return res.status(400).json({ success: false });
  await prisma.order.update({ where: { id: o.id }, data: { status: "PAID" } });
  if (o.directReferrerId && o.directCommission && Number(o.directCommission) > 0) {
    const w = await prisma.wallet.findUnique({ where: { userId: o.directReferrerId } });
    if (w) {
      const nb = Number(w.balance) + Number(o.directCommission);
      await prisma.wallet.update({ where: { id: w.id }, data: { balance: nb } });
      await prisma.walletTransaction.create({ data: { walletId: w.id, type: "COMMISSION", amount: o.directCommission, status: "SUCCESS", orderId: o.id } });
    }
  }
  if (o.indirectReferrerId && o.indirectCommission && Number(o.indirectCommission) > 0) {
    const w = await prisma.wallet.findUnique({ where: { userId: o.indirectReferrerId } });
    if (w) {
      const nb = Number(w.balance) + Number(o.indirectCommission);
      await prisma.wallet.update({ where: { id: w.id }, data: { balance: nb } });
      await prisma.walletTransaction.create({ data: { walletId: w.id, type: "COMMISSION", amount: o.indirectCommission, status: "SUCCESS", orderId: o.id } });
    }
  }
  res.json({ success: true });
});
export default r;