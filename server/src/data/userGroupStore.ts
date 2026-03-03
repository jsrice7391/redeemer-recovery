import { prisma } from '../database/prisma';

export const userGroupStore = {
  getUserGroups: async (userId: number) => {
    return await prisma.userGroup.findMany({
      where: { userId },
      include: {
        group: {
          include: {
            facilitator: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  },

  joinGroup: async (userId: number, groupId: number, isPrimary = false) => {
    return await prisma.userGroup.upsert({
      where: { userId_groupId: { userId, groupId } },
      create: { userId, groupId, isPrimary },
      update: { isPrimary },
      include: {
        group: {
          include: { facilitator: true },
        },
      },
    });
  },

  leaveGroup: async (userId: number, groupId: number) => {
    try {
      await prisma.userGroup.delete({
        where: { userId_groupId: { userId, groupId } },
      });
      return true;
    } catch {
      return false;
    }
  },

  getUserContact: async (userId: number) => {
    // Return facilitator of primary group, or first group if none is primary
    const userGroups = await prisma.userGroup.findMany({
      where: { userId },
      include: {
        group: {
          include: { facilitator: true },
        },
      },
      orderBy: [{ isPrimary: 'desc' }, { joinedAt: 'asc' }],
    });

    for (const ug of userGroups) {
      if (ug.group.facilitator) {
        return ug.group.facilitator;
      }
    }
    return null;
  },
};
