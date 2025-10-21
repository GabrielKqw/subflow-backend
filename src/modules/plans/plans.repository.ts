import prisma from '../../shared/config/database';
import { Plan, Prisma } from '@prisma/client';

export class PlansRepository {
  async create(data: {
    name: string;
    description?: string;
    price: number;
    durationDays: number;
    features: string[];
    isActive?: boolean;
  }): Promise<Plan> {
    return prisma.plan.create({
      data: {
        name: data.name,
        description: data.description,
        price: new Prisma.Decimal(data.price),
        durationDays: data.durationDays,
        features: data.features,
        isActive: data.isActive ?? true,
      },
    });
  }

  async findAll(activeOnly: boolean = false): Promise<Plan[]> {
    return prisma.plan.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { price: 'asc' },
    });
  }

  async findById(id: string): Promise<Plan | null> {
    return prisma.plan.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    durationDays?: number;
    features?: string[];
    isActive?: boolean;
  }): Promise<Plan> {
    const updateData: any = { ...data };
    
    if (data.price !== undefined) {
      updateData.price = new Prisma.Decimal(data.price);
    }

    return prisma.plan.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Plan> {
    return prisma.plan.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const plan = await prisma.plan.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!plan;
  }

  async countActiveSubscriptions(planId: string): Promise<number> {
    return prisma.subscription.count({
      where: {
        planId,
        status: 'ACTIVE',
      },
    });
  }
}

