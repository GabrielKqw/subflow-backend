import { PrismaClient, ActivityLog } from '@prisma/client';
import { CreateActivityLogDTO, FilterActivityLogsDTO } from './activity-logs.dto';

const prisma = new PrismaClient();

export class ActivityLogsRepository {
  async create(data: CreateActivityLogDTO): Promise<ActivityLog> {
    return prisma.activityLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async findAll(filters: FilterActivityLogsDTO): Promise<ActivityLog[]> {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = { contains: filters.action, mode: 'insensitive' };
    if (filters.resource) where.resource = filters.resource;
    
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    return prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0,
    });
  }

  async findByUserId(userId: string, limit = 50): Promise<ActivityLog[]> {
    return prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findById(id: string): Promise<ActivityLog | null> {
    return prisma.activityLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
    });
  }

  async count(filters: FilterActivityLogsDTO): Promise<number> {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = { contains: filters.action, mode: 'insensitive' };
    if (filters.resource) where.resource = filters.resource;
    
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    return prisma.activityLog.count({ where });
  }

  async deleteOlderThan(days: number): Promise<number> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    const result = await prisma.activityLog.deleteMany({
      where: {
        createdAt: {
          lt: date,
        },
      },
    });

    return result.count;
  }
}

