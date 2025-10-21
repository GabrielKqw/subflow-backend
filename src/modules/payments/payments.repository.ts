import prisma from '../../shared/config/database';
import { Payment, PaymentStatus, PaymentMethod, Prisma } from '@prisma/client';

export class PaymentsRepository {
  async create(data: {
    userId: string;
    subscriptionId: string;
    amount: number;
    method: PaymentMethod;
    status?: PaymentStatus;
    externalId?: string;
    externalData?: any;
  }): Promise<Payment> {
    return prisma.payment.create({
      data: {
        userId: data.userId,
        subscriptionId: data.subscriptionId,
        amount: new Prisma.Decimal(data.amount),
        method: data.method,
        status: data.status || 'PENDING',
        externalId: data.externalId,
        externalData: data.externalData,
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
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

  async findById(id: string): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
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

  async findByUserId(userId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: { userId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findBySubscriptionId(subscriptionId: string): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: { subscriptionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByExternalId(externalId: string): Promise<Payment | null> {
    return prisma.payment.findFirst({
      where: { externalId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
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

  async findAll(status?: PaymentStatus): Promise<Payment[]> {
    return prisma.payment.findMany({
      where: status ? { status } : undefined,
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
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
      status?: PaymentStatus;
      externalId?: string;
      externalData?: any;
      paidAt?: Date;
    }
  ): Promise<Payment> {
    return prisma.payment.update({
      where: { id },
      data,
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
  }

  async countByStatus(status: PaymentStatus): Promise<number> {
    return prisma.payment.count({
      where: { status },
    });
  }

  async getTotalRevenue(): Promise<number> {
    const result = await prisma.payment.aggregate({
      where: { status: 'APPROVED' },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount ? Number(result._sum.amount) : 0;
  }
}

