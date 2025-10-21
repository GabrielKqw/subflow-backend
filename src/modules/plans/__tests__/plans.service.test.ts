import { PlansService } from '../plans.service';
import { PlansRepository } from '../plans.repository';
import { NotFoundError, ConflictError } from '../../../shared/errors/AppError';

jest.mock('../plans.repository');

describe('PlansService', () => {
  let plansService: PlansService;
  let plansRepository: jest.Mocked<PlansRepository>;

  beforeEach(() => {
    plansService = new PlansService();
    plansRepository = (plansService as any).plansRepository;
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new plan successfully', async () => {
      const mockPlan = {
        id: '1',
        name: 'Basic Plan',
        description: 'Basic subscription',
        price: 29.90,
        durationDays: 30,
        features: ['Feature 1', 'Feature 2'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      plansRepository.create = jest.fn().mockResolvedValue(mockPlan);

      const result = await plansService.create({
        name: 'Basic Plan',
        description: 'Basic subscription',
        price: 29.90,
        durationDays: 30,
        features: ['Feature 1', 'Feature 2'],
        isActive: true,
      });

      expect(result).toEqual(mockPlan);
      expect(plansRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a plan when it exists', async () => {
      const mockPlan = {
        id: '1',
        name: 'Basic Plan',
        description: 'Basic subscription',
        price: 29.90,
        durationDays: 30,
        features: ['Feature 1'],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      plansRepository.findById = jest.fn().mockResolvedValue(mockPlan);

      const result = await plansService.findById('1');

      expect(result).toEqual(mockPlan);
    });

    it('should throw NotFoundError when plan does not exist', async () => {
      plansRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(plansService.findById('999')).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('should throw NotFoundError when plan does not exist', async () => {
      plansRepository.exists = jest.fn().mockResolvedValue(false);

      await expect(plansService.delete('999')).rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError when plan has active subscriptions', async () => {
      plansRepository.exists = jest.fn().mockResolvedValue(true);
      plansRepository.countActiveSubscriptions = jest.fn().mockResolvedValue(5);

      await expect(plansService.delete('1')).rejects.toThrow(ConflictError);
    });

    it('should delete plan when it has no active subscriptions', async () => {
      plansRepository.exists = jest.fn().mockResolvedValue(true);
      plansRepository.countActiveSubscriptions = jest.fn().mockResolvedValue(0);
      plansRepository.delete = jest.fn().mockResolvedValue({} as any);

      await plansService.delete('1');

      expect(plansRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});

