import { prisma } from '../database/prisma';
import { CreateFacilitatorDto, UpdateFacilitatorDto } from '../types/facilitator';

export const facilitatorStore = {
  getAll: async () => {
    return await prisma.facilitator.findMany({
      orderBy: { name: 'asc' },
    });
  },

  getById: async (id: number) => {
    return await prisma.facilitator.findUnique({
      where: { id },
    });
  },

  create: async (data: CreateFacilitatorDto) => {
    return await prisma.facilitator.create({
      data,
    });
  },

  update: async (id: number, data: UpdateFacilitatorDto) => {
    try {
      return await prisma.facilitator.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  },

  delete: async (id: number) => {
    try {
      await prisma.facilitator.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
