import prisma from '../../shared/config/database';
import { Subscription, SubscriptionStatus } from '@prisma/client';

export class SubscriptionsRepository {
  async create(data: {
    userId: string;
    planId: string;
    startDate: Date;
    endDate: Date;
    status: SubscriptionStatus;
  }): Promise<Subscription> {
    return prisma.subscription.create({
      data,
      include: {
        plan: true,
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

  async findById(id: string): Promise<Subscription | null> {
    return prisma.subscription.findUnique({
      where: { id },
      include: {
        plan: true,
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

  async findByUserId(userId: string): Promise<Subscription[]> {
    return prisma.subscription.findMany({
      where: { userId },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findActiveByUserId(userId: string): Promise<Subscription[]> {
    return prisma.subscription.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAll(status?: SubscriptionStatus): Promise<Subscription[]> {
    return prisma.subscription.findMany({
      where: status ? { status } : undefined,
      include: {
        plan: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(
    id: string,
    data: {
      status?: SubscriptionStatus;
      endDate?: Date;
      cancelledAt?: Date;
    }
  ): Promise<Subscription> {
    return prisma.subscription.update({
      where: { id },
      data,
      include: {
        plan: true,
      },
    });
  }

  async hasActiveSubscription(userId: string, planId: string): Promise<boolean> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        planId,
        status: 'ACTIVE',
      },
    });
    return !!subscription;
  }

  async countActiveByPlanId(planId: string): Promise<number> {
    return prisma.subscription.count({
      where: {
        planId,
        status: 'ACTIVE',
      },
    });
  }

  async findExpiredSubscriptions(): Promise<Subscription[]> {
    return prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lt: new Date(),
        },
      },
      include: {
        plan: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }
}

