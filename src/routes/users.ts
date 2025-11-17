import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middlewares/auth";
const prisma = new PrismaClient();
const r = Router();
r.get("/me", auth, async (req, res) => {
  const u = (req as any).user;
  const user = await prisma.user.findUnique({ where: { id: u.userId }, include: { membership: true } });
  res.json({ success: true, data: user });
});
r.post("/assign-agentA/:id", async (req, res) => {
  const id = req.params.id;
  await prisma.user.update({ where: { id }, data: { isAgentA: true } });
  res.json({ success: true });
});
export default r;