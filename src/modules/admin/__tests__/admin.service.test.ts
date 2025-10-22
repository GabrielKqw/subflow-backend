import { AdminService } from '../admin.service';
import { AdminRepository } from '../admin.repository';
import { AppError } from '../../../shared/errors/AppError';

jest.mock('../admin.repository');

describe('AdminService', () => {
  let service: AdminService;
  let repository: jest.Mocked<AdminRepository>;

  beforeEach(() => {
    service = new AdminService();
    repository = (service as any).repository;
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        { id: '1', email: 'user1@example.com', name: 'User 1' },
        { id: '2', email: 'user2@example.com', name: 'User 2' },
      ];

      repository.findAll.mockResolvedValue(mockUsers as any);
      repository.count.mockResolvedValue(2);

      const result = await service.getAllUsers({ page: 1, limit: 20 });

      expect(result.users).toEqual(mockUsers);
      expect(result.total).toBe(2);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: '1', email: 'user@example.com' };
      repository.findById.mockResolvedValue(mockUser as any);

      const result = await service.getUserById('1');

      expect(result).toEqual(mockUser);
    });

    it('should throw error if user not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.getUserById('invalid-id')).rejects.toThrow('User not found');
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const mockUser = { id: '1', email: 'user@example.com', name: 'User' };
      const updateData = { name: 'Updated Name' };

      repository.findById.mockResolvedValue(mockUser as any);
      repository.update.mockResolvedValue({ ...mockUser, ...updateData } as any);

      const result = await service.updateUser('1', updateData);

      expect(result.name).toBe('Updated Name');
    });

    it('should throw error if email already exists', async () => {
      const mockUser = { id: '1', email: 'user@example.com' };
      const updateData = { email: 'existing@example.com' };

      repository.findById.mockResolvedValue(mockUser as any);
      repository.findByEmail.mockResolvedValue({ id: '2' } as any);

      await expect(service.updateUser('1', updateData)).rejects.toThrow('Email already in use');
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const mockUser = { id: '1', email: 'user@example.com' };

      repository.findById.mockResolvedValue(mockUser as any);
      repository.hasActiveSubscriptions.mockResolvedValue(false);
      repository.delete.mockResolvedValue(undefined);

      await service.deleteUser('1');

      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error if user has active subscriptions', async () => {
      const mockUser = { id: '1', email: 'user@example.com' };

      repository.findById.mockResolvedValue(mockUser as any);
      repository.hasActiveSubscriptions.mockResolvedValue(true);

      await expect(service.deleteUser('1')).rejects.toThrow(
        'Cannot delete user with active subscriptions'
      );
    });
  });

  describe('getDashboardStats', () => {
    it('should return dashboard statistics', async () => {
      repository.countUsers.mockResolvedValue({ total: 10, admins: 2, regular: 8 });
      repository.countPlans.mockResolvedValue({ total: 3, active: 3 });
      repository.countSubscriptions.mockResolvedValue({
        total: 20,
        active: 15,
        pending: 3,
        cancelled: 1,
        expired: 1,
      });
      repository.countPayments.mockResolvedValue({
        total: 25,
        pending: 5,
        approved: 18,
        rejected: 2,
      });
      repository.getTotalRevenue.mockResolvedValue({ total: 1500 });

      const result = await service.getDashboardStats();

      expect(result.users.total).toBe(10);
      expect(result.subscriptions.active).toBe(15);
      expect(result.revenue).toBe(1500);
    });
  });
});

