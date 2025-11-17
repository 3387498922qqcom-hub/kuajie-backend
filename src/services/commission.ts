import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function computeCommissions(userId: string, total: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const direct = user?.inviterId || null;
  let indirect: string | null = null;
  if (direct) {
    const du = await prisma.user.findUnique({ where: { id: direct } });
    indirect = du?.inviterId || null;
  }
  const directUser = direct ? await prisma.user.findUnique({ where: { id: direct } }) : null;
  const rateDirect = directUser?.isAgentA ? 0.2 : 0.1;
  const rateIndirect = 0.1;
  const d = direct ? +(total * rateDirect).toFixed(2) : 0;
  const i = indirect ? +(total * rateIndirect).toFixed(2) : 0;
  return { directReferrerId: direct, indirectReferrerId: indirect, directCommission: d, indirectCommission: i };
}