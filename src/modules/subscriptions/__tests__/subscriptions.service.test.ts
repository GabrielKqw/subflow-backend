import { SubscriptionsService } from '../subscriptions.service';
import { SubscriptionsRepository } from '../subscriptions.repository';
import { PlansRepository } from '../../plans/plans.repository';
import { NotFoundError, ConflictError } from '../../../shared/errors/AppError';

jest.mock('../subscriptions.repository');
jest.mock('../../plans/plans.repository');

describe('SubscriptionsService', () => {
  let subscriptionsService: SubscriptionsService;
  let subscriptionsRepository: jest.Mocked<SubscriptionsRepository>;
  let plansRepository: jest.Mocked<PlansRepository>;

  beforeEach(() => {
    subscriptionsService = new SubscriptionsService();
    subscriptionsRepository = (subscriptionsService as any).subscriptionsRepository;
    plansRepository = (subscriptionsService as any).plansRepository;
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a subscription successfully', async () => {
      const mockPlan = {
        id: '1',
        name: 'Basic',
        price: 29.90,
        durationDays: 30,
        isActive: true,
      };

      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        planId: '1',
        status: 'PENDING',
        startDate: new Date(),
        endDate: new Date(),
      };

      plansRepository.findById = jest.fn().mockResolvedValue(mockPlan);
      subscriptionsRepository.hasActiveSubscription = jest.fn().mockResolvedValue(false);
      subscriptionsRepository.create = jest.fn().mockResolvedValue(mockSubscription);

      const result = await subscriptionsService.create('user-1', { planId: '1' });

      expect(result).toEqual(mockSubscription);
      expect(subscriptionsRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError when plan does not exist', async () => {
      plansRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(
        subscriptionsService.create('user-1', { planId: '999' })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError when plan is not active', async () => {
      const mockPlan = {
        id: '1',
        name: 'Basic',
        isActive: false,
      };

      plansRepository.findById = jest.fn().mockResolvedValue(mockPlan);

      await expect(
        subscriptionsService.create('user-1', { planId: '1' })
      ).rejects.toThrow(ConflictError);
    });

    it('should throw ConflictError when user already has active subscription', async () => {
      const mockPlan = {
        id: '1',
        name: 'Basic',
        isActive: true,
      };

      plansRepository.findById = jest.fn().mockResolvedValue(mockPlan);
      subscriptionsRepository.hasActiveSubscription = jest.fn().mockResolvedValue(true);

      await expect(
        subscriptionsService.create('user-1', { planId: '1' })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('cancel', () => {
    it('should cancel subscription successfully', async () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        status: 'ACTIVE',
      };

      const mockUpdated = {
        ...mockSubscription,
        status: 'CANCELLED',
        cancelledAt: new Date(),
      };

      subscriptionsRepository.findById = jest.fn().mockResolvedValue(mockSubscription);
      subscriptionsRepository.update = jest.fn().mockResolvedValue(mockUpdated);

      const result = await subscriptionsService.cancel('sub-1', 'user-1');

      expect(result.status).toBe('CANCELLED');
      expect(subscriptionsRepository.update).toHaveBeenCalledWith('sub-1', {
        status: 'CANCELLED',
        cancelledAt: expect.any(Date),
      });
    });

    it('should throw ConflictError when subscription is already cancelled', async () => {
      const mockSubscription = {
        id: 'sub-1',
        userId: 'user-1',
        status: 'CANCELLED',
      };

      subscriptionsRepository.findById = jest.fn().mockResolvedValue(mockSubscription);

      await expect(
        subscriptionsService.cancel('sub-1', 'user-1')
      ).rejects.toThrow(ConflictError);
    });
  });
});

