import { Payment } from '@prisma/client';
import { PaymentsRepository } from './payments.repository';
import { SubscriptionsRepository } from '../subscriptions/subscriptions.repository';
import { InitiatePaymentDTO, UpdatePaymentStatusDTO } from './payments.dto';
import { NotFoundError, ForbiddenError, ConflictError } from '../../shared/errors/AppError';

export class PaymentsService {
  private paymentsRepository: PaymentsRepository;
  private subscriptionsRepository: SubscriptionsRepository;

  constructor() {
    this.paymentsRepository = new PaymentsRepository();
    this.subscriptionsRepository = new SubscriptionsRepository();
  }

  async initiatePayment(userId: string, data: InitiatePaymentDTO): Promise<Payment> {
    const subscription = await this.subscriptionsRepository.findById(data.subscriptionId);

    if (!subscription) {
      throw new NotFoundError('Subscription not found');
    }

    if (subscription.userId !== userId) {
      throw new ForbiddenError('Access denied to this subscription');
    }

    if (subscription.status === 'ACTIVE') {
      throw new ConflictError('Subscription is already active');
    }

    if (subscription.status === 'CANCELLED') {
      throw new ConflictError('Cannot pay for a cancelled subscription');
    }

    const existingPayments = await this.paymentsRepository.findBySubscriptionId(
      data.subscriptionId
    );

    const hasPendingOrApproved = existingPayments.some(
      (p) => p.status === 'PENDING' || p.status === 'APPROVED'
    );

    if (hasPendingOrApproved) {
      throw new ConflictError('Subscription already has a pending or approved payment');
    }

    const payment = await this.paymentsRepository.create({
      userId,
      subscriptionId: data.subscriptionId,
      amount: Number(subscription.plan.price),
      method: data.method,
      status: 'PENDING',
    });

    return payment;
  }

  async findById(id: string, userId?: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findById(id);

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    if (userId && payment.userId !== userId) {
      throw new ForbiddenError('Access denied to this payment');
    }

    return payment;
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    return this.paymentsRepository.findByUserId(userId);
  }

  async findAll(status?: string): Promise<Payment[]> {
    return this.paymentsRepository.findAll(
      status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED' | 'CANCELLED' | undefined
    );
  }

  async updatePaymentStatus(
    id: string,
    data: UpdatePaymentStatusDTO
  ): Promise<Payment> {
    const payment = await this.paymentsRepository.findById(id);

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    const updateData: any = {
      status: data.status,
      externalId: data.externalId,
      externalData: data.externalData,
    };

    if (data.status === 'APPROVED') {
      updateData.paidAt = new Date();

      await this.subscriptionsRepository.update(payment.subscriptionId, {
        status: 'ACTIVE',
      });
    }

    const updatedPayment = await this.paymentsRepository.update(id, updateData);

    return updatedPayment;
  }

  async processWebhook(externalId: string, status: string, externalData?: any): Promise<Payment> {
    const payment = await this.paymentsRepository.findByExternalId(externalId);

    if (!payment) {
      throw new NotFoundError('Payment not found');
    }

    const paymentStatus = this.mapWebhookStatus(status);

    return this.updatePaymentStatus(payment.id, {
      status: paymentStatus,
      externalData,
    });
  }

  private mapWebhookStatus(
    webhookStatus: string
  ): 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED' | 'CANCELLED' {
    const statusMap: Record<string, any> = {
      approved: 'APPROVED',
      paid: 'APPROVED',
      success: 'APPROVED',
      rejected: 'REJECTED',
      cancelled: 'CANCELLED',
      refunded: 'REFUNDED',
      pending: 'PENDING',
    };

    return statusMap[webhookStatus.toLowerCase()] || 'PENDING';
  }

  async getPaymentStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    revenue: number;
  }> {
    const [pending, approved, rejected, revenue] = await Promise.all([
      this.paymentsRepository.countByStatus('PENDING'),
      this.paymentsRepository.countByStatus('APPROVED'),
      this.paymentsRepository.countByStatus('REJECTED'),
      this.paymentsRepository.getTotalRevenue(),
    ]);

    return {
      total: pending + approved + rejected,
      pending,
      approved,
      rejected,
      revenue,
    };
  }
}

