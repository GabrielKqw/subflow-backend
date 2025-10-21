import { Subscription } from '@prisma/client';
import { SubscriptionsRepository } from './subscriptions.repository';
import { PlansRepository } from '../plans/plans.repository';
import { CreateSubscriptionDTO } from './subscriptions.dto';
import { NotFoundError, ConflictError, ForbiddenError } from '../../shared/errors/AppError';
import { calculateEndDate } from '../../shared/utils/date';

export class SubscriptionsService {
  private subscriptionsRepository: SubscriptionsRepository;
  private plansRepository: PlansRepository;

  constructor() {
    this.subscriptionsRepository = new SubscriptionsRepository();
    this.plansRepository = new PlansRepository();
  }

  async create(userId: string, data: CreateSubscriptionDTO): Promise<Subscription> {
    const plan = await this.plansRepository.findById(data.planId);

    if (!plan) {
      throw new NotFoundError('Plan not found');
    }

    if (!plan.isActive) {
      throw new ConflictError('Plan is not active');
    }

    const hasActiveSubscription = await this.subscriptionsRepository.hasActiveSubscription(
      userId,
      data.planId
    );

    if (hasActiveSubscription) {
      throw new ConflictError('User already has an active subscription for this plan');
    }

    const startDate = new Date();
    const endDate = calculateEndDate(startDate, plan.durationDays);

    const subscription = await this.subscriptionsRepository.create({
      userId,
      planId: data.planId,
      startDate,
      endDate,
      status: 'PENDING',
    });

    return subscription;
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return this.subscriptionsRepository.findByUserId(userId);
  }

  async findActiveByUserId(userId: string): Promise<Subscription[]> {
    return this.subscriptionsRepository.findActiveByUserId(userId);
  }

  async findById(id: string, userId?: string): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findById(id);

    if (!subscription) {
      throw new NotFoundError('Subscription not found');
    }

    if (userId && subscription.userId !== userId) {
      throw new ForbiddenError('Access denied to this subscription');
    }

    return subscription;
  }

  async findAll(status?: string): Promise<Subscription[]> {
    return this.subscriptionsRepository.findAll(
      status as 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PENDING' | undefined
    );
  }

  async cancel(id: string, userId: string): Promise<Subscription> {
    const subscription = await this.findById(id, userId);

    if (subscription.status === 'CANCELLED') {
      throw new ConflictError('Subscription is already cancelled');
    }

    if (subscription.status === 'EXPIRED') {
      throw new ConflictError('Cannot cancel an expired subscription');
    }

    const updatedSubscription = await this.subscriptionsRepository.update(id, {
      status: 'CANCELLED',
      cancelledAt: new Date(),
    });

    return updatedSubscription;
  }

  async activate(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findById(id);

    if (!subscription) {
      throw new NotFoundError('Subscription not found');
    }

    if (subscription.status === 'ACTIVE') {
      throw new ConflictError('Subscription is already active');
    }

    const updatedSubscription = await this.subscriptionsRepository.update(id, {
      status: 'ACTIVE',
    });

    return updatedSubscription;
  }

  async renewSubscription(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionsRepository.findById(id);

    if (!subscription) {
      throw new NotFoundError('Subscription not found');
    }

    if (subscription.status !== 'ACTIVE') {
      throw new ConflictError('Only active subscriptions can be renewed');
    }

    const plan = await this.plansRepository.findById(subscription.planId);

    if (!plan) {
      throw new NotFoundError('Plan not found');
    }

    const newEndDate = calculateEndDate(subscription.endDate, plan.durationDays);

    const updatedSubscription = await this.subscriptionsRepository.update(id, {
      endDate: newEndDate,
    });

    return updatedSubscription;
  }

  async expireSubscriptions(): Promise<number> {
    const expiredSubscriptions = await this.subscriptionsRepository.findExpiredSubscriptions();

    for (const subscription of expiredSubscriptions) {
      await this.subscriptionsRepository.update(subscription.id, {
        status: 'EXPIRED',
      });
    }

    return expiredSubscriptions.length;
  }
}

