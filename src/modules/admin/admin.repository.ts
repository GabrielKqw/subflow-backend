import { PrismaClient, UserRole, User } from '@prisma/client';
import { UpdateUserDTO } from './admin.dto';

const prisma = new PrismaClient();

export class AdminRepository {
  async findAll(params: { limit: number; offset: number; role?: UserRole }) {
    const where = params.role ? { role: params.role } : {};

    return prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            subscriptions: true,
            payments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: params.limit,
      skip: params.offset,
    });
  }

  async count(role?: UserRole): Promise<number> {
    const where = role ? { role } : {};
    return prisma.user.count({ where });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        subscriptions: {
          include: {
            plan: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            subscriptions: true,
            payments: true,
            activityLogs: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: UpdateUserDTO) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateRole(id: string, role: UserRole) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async hasActiveSubscriptions(userId: string): Promise<boolean> {
    const count = await prisma.subscription.count({
      where: {
        userId,
        status: 'ACTIVE',
      },
    });

    return count > 0;
  }

  async countUsers() {
    const [total, admins, regular] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'USER' } }),
    ]);

    return { total, admins, regular };
  }

  async countPlans() {
    const [total, active] = await Promise.all([
      prisma.plan.count(),
      prisma.plan.count({ where: { isActive: true } }),
    ]);

    return { total, active };
  }

  async countSubscriptions() {
    const [total, active, pending, cancelled, expired] = await Promise.all([
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.subscription.count({ where: { status: 'PENDING' } }),
      prisma.subscription.count({ where: { status: 'CANCELLED' } }),
      prisma.subscription.count({ where: { status: 'EXPIRED' } }),
    ]);

    return { total, active, pending, cancelled, expired };
  }

  async countPayments() {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.payment.count(),
      prisma.payment.count({ where: { status: 'PENDING' } }),
      prisma.payment.count({ where: { status: 'APPROVED' } }),
      prisma.payment.count({ where: { status: 'REJECTED' } }),
    ]);

    return { total, pending, approved, rejected };
  }

  async getTotalRevenue() {
    const result = await prisma.payment.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amount: true },
    });

    return { total: result._sum.amount || 0 };
  }
}

