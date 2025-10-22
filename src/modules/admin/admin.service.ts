import { AdminRepository } from './admin.repository';
import { UpdateUserDTO } from './admin.dto';
import { UserRole } from '@prisma/client';
import { AppError } from '../../shared/errors/AppError';

export class AdminService {
  private repository: AdminRepository;

  constructor() {
    this.repository = new AdminRepository();
  }

  async getAllUsers(params: { page: number; limit: number; role?: string }) {
    const offset = (params.page - 1) * params.limit;
    
    const [users, total] = await Promise.all([
      this.repository.findAll({ limit: params.limit, offset, role: params.role as UserRole }),
      this.repository.count(params.role as UserRole),
    ]);

    return { users, total };
  }

  async getUserById(id: string) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.repository.findByEmail(data.email);
      if (existingUser) {
        throw new AppError('Email already in use', 400);
      }
    }

    return this.repository.update(id, data);
  }

  async updateUserRole(id: string, role: UserRole) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.repository.updateRole(id, role);
  }

  async deleteUser(id: string) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const hasActiveSubscriptions = await this.repository.hasActiveSubscriptions(id);

    if (hasActiveSubscriptions) {
      throw new AppError('Cannot delete user with active subscriptions', 400);
    }

    await this.repository.delete(id);
  }

  async getDashboardStats() {
    const [totalUsers, totalPlans, totalSubscriptions, totalPayments, revenueData] = await Promise.all([
      this.repository.countUsers(),
      this.repository.countPlans(),
      this.repository.countSubscriptions(),
      this.repository.countPayments(),
      this.repository.getTotalRevenue(),
    ]);

    return {
      users: {
        total: totalUsers.total,
        admins: totalUsers.admins,
        regular: totalUsers.regular,
      },
      plans: totalPlans,
      subscriptions: {
        total: totalSubscriptions.total,
        active: totalSubscriptions.active,
        pending: totalSubscriptions.pending,
        cancelled: totalSubscriptions.cancelled,
        expired: totalSubscriptions.expired,
      },
      payments: {
        total: totalPayments.total,
        pending: totalPayments.pending,
        approved: totalPayments.approved,
        rejected: totalPayments.rejected,
      },
      revenue: revenueData.total,
    };
  }
}

