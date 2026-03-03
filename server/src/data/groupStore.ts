import { prisma } from '../database/prisma';
import { CreateGroupDto, UpdateGroupDto, GroupSearchParams } from '../types/group';

class GroupStore {
  async getAll() {
    return await prisma.group.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async search({ searchTerm, focusArea, meetingDay }: GroupSearchParams) {
    const where: any = {};

    // Filter by search term (location, city, state, or zip)
    if (searchTerm) {
      where.OR = [
        { city: { contains: searchTerm, mode: 'insensitive' } },
        { state: { contains: searchTerm, mode: 'insensitive' } },
        { zipCode: { contains: searchTerm } },
        { location: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Filter by focus area
    if (focusArea && focusArea !== 'all') {
      where.focusArea = focusArea;
    }

    // Filter by meeting day
    if (meetingDay && meetingDay !== 'all') {
      where.meetingDay = meetingDay;
    }

    return await prisma.group.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getById(id: number) {
    return await prisma.group.findUnique({
      where: { id },
    });
  }

  async create(data: CreateGroupDto) {
    return await prisma.group.create({
      data,
    });
  }

  async update(id: number, data: UpdateGroupDto) {
    try {
      return await prisma.group.update({
        where: { id },
        data,
      });
    } catch (error) {
      return null;
    }
  }

  async delete(id: number) {
    try {
      await prisma.group.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const groupStore = new GroupStore();
