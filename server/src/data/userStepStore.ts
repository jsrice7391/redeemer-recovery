import { prisma } from '../database/prisma';
import { UpsertUserStepDto } from '../types/userStep';

export const userStepStore = {
  getUserStep: async (userId: number) => {
    return await prisma.userStep.findUnique({
      where: { userId },
    });
  },

  upsertUserStep: async (userId: number, data: UpsertUserStepDto) => {
    return await prisma.userStep.upsert({
      where: { userId },
      create: { userId, ...data },
      update: { ...data },
    });
  },
};
