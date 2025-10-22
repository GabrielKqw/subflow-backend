import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { updateUserRoleSchema, updateUserSchema } from './admin.dto';

export class AdminController {
  private service: AdminService;

  constructor() {
    this.service = new AdminService();
  }

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const role = req.query.role as string | undefined;

    const result = await this.service.getAllUsers({ page, limit, role });

    res.json({
      message: 'Users retrieved successfully',
      data: result.users,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await this.service.getUserById(id);

    res.json({
      message: 'User retrieved successfully',
      data: user,
    });
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = updateUserSchema.parse(req.body);

    const user = await this.service.updateUser(id, data);

    res.json({
      message: 'User updated successfully',
      data: user,
    });
  };

  updateUserRole = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { role } = updateUserRoleSchema.parse(req.body);

    const user = await this.service.updateUserRole(id, role);

    res.json({
      message: 'User role updated successfully',
      data: user,
    });
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    await this.service.deleteUser(id);

    res.json({
      message: 'User deleted successfully',
    });
  };

  getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    const stats = await this.service.getDashboardStats();

    res.json({
      message: 'Dashboard statistics retrieved successfully',
      data: stats,
    });
  };
}

