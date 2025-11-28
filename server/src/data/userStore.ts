import { prisma } from '../database/prisma';
import { User } from '../types/user';

export const userStore = {
  getAll: async (): Promise<User[]> => {
    return await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  },
  
  getById: async (id: number): Promise<User | null> => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },
  
  getByEmail: async (email: string): Promise<User | null> => {
    return await prisma.user.findUnique({
      where: { email },
    });
  },
  
  create: async (name: string, email: string): Promise<User> => {
    return await prisma.user.create({
      data: {
        name,
        email,
      },
    });
  },
  
  update: async (id: number, name?: string, email?: string): Promise<User | null> => {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(email !== undefined && { email }),
        },
      });
    } catch (error) {
      // User not found
      return null;
    }
  },
  
  delete: async (id: number): Promise<boolean> => {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      // User not found
      return false;
    }
  },
};
