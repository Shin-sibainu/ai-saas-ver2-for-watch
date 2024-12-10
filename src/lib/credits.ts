import { prisma } from "./prisma";

export async function addCredits(userId: string, amount: number, action: string, details?: string) {
  return await prisma.$transaction(async (tx) => {
    // クレジットを追加
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        credits: { increment: amount },
      },
    });

    // ログを記録
    await tx.creditLog.create({
      data: {
        userId,
        amount,
        action,
        details,
      },
    });

    return updatedUser;
  });
}

export async function useCredits(userId: string, amount: number, action: string, details?: string) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.credits < amount) {
      throw new Error("Insufficient credits");
    }

    // クレジットを消費
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: amount },
      },
    });

    // ログを記録
    await tx.creditLog.create({
      data: {
        userId,
        amount: -amount,
        action,
        details,
      },
    });

    return updatedUser;
  });
}

export async function getCreditHistory(userId: string) {
  return await prisma.creditLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
} 