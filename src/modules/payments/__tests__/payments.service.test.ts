import { PaymentsService } from '../payments.service';
import { PaymentsRepository } from '../payments.repository';
import { SubscriptionsRepository } from '../../subscriptions/subscriptions.repository';
import { NotFoundError, ForbiddenError, ConflictError } from '../../../shared/errors/AppError';

jest.mock('../payments.repository');
jest.mock('../../subscriptions/subscriptions.repository');

describe('PaymentsService', () => {
  let paymentsService: PaymentsService;
  let paymentsRepository: jest.Mocked<PaymentsRepository>;
  let subscriptionsRepository: jest.Mocked<SubscriptionsRepository>;

  beforeEach(() => {
    paymentsService = new PaymentsService();
    paymentsRepository = (paymentsService as any).paymentsRepository;
    subscriptionsRepository = (paymentsService as any).subscriptionsRepository;
    jest.clearAllMocks();
  });

  describe('initiatePayment', () => {
    it('should initiate payment successfully', async () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        status: 'PENDING',
        plan: {
          price: 29.90,
        },
      };

      const mockPayment = {
        id: 'pay-1',
        userId: 'user-1',
        subscriptionId: 'sub-1',
        amount: 29.90,
        status: 'PENDING',
        method: 'CREDIT_CARD',
      };

      subscriptionsRepository.findById = jest.fn().mockResolvedValue(mockSubscription);
      paymentsRepository.findBySubscriptionId = jest.fn().mockResolvedValue([]);
      paymentsRepository.create = jest.fn().mockResolvedValue(mockPayment);

      const result = await paymentsService.initiatePayment('user-1', {
        subscriptionId: 'sub-1',
        method: 'CREDIT_CARD',
      });

      expect(result).toEqual(mockPayment);
      expect(paymentsRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError when subscription does not exist', async () => {
      subscriptionsRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(
        paymentsService.initiatePayment('user-1', {
          subscriptionId: 'sub-999',
          method: 'CREDIT_CARD',
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ForbiddenError when user does not own subscription', async () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-2',
        status: 'PENDING',
      };

      subscriptionsRepository.findById = jest.fn().mockResolvedValue(mockSubscription);

      await expect(
        paymentsService.initiatePayment('user-1', {
          subscriptionId: 'sub-1',
          method: 'CREDIT_CARD',
        })
      ).rejects.toThrow(ForbiddenError);
    });

    it('should throw ConflictError when subscription is already active', async () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        status: 'ACTIVE',
      };

      subscriptionsRepository.findById = jest.fn().mockResolvedValue(mockSubscription);

      await expect(
        paymentsService.initiatePayment('user-1', {
          subscriptionId: 'sub-1',
          method: 'CREDIT_CARD',
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status and activate subscription on approval', async () => {
      const mockPayment = {
        id: 'pay-1',
        subscriptionId: 'sub-1',
        status: 'PENDING',
      };

      const mockUpdated = {
        ...mockPayment,
        status: 'APPROVED',
        paidAt: expect.any(Date),
      };

      paymentsRepository.findById = jest.fn().mockResolvedValue(mockPayment);
      paymentsRepository.update = jest.fn().mockResolvedValue(mockUpdated);
      subscriptionsRepository.update = jest.fn().mockResolvedValue({} as any);

      await paymentsService.updatePaymentStatus('pay-1', {
        status: 'APPROVED',
      });

      expect(subscriptionsRepository.update).toHaveBeenCalledWith('sub-1', {
        status: 'ACTIVE',
      });
    });
  });
});

