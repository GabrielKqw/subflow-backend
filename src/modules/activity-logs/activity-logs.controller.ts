import { Request, Response } from 'express';
import { ActivityLogsService } from './activity-logs.service';
import { filterActivityLogsSchema } from './activity-logs.dto';

export class ActivityLogsController {
  private service: ActivityLogsService;

  constructor() {
    this.service = new ActivityLogsService();
  }

  getAll = async (req: Request, res: Response): Promise<void> => {
    const filters = filterActivityLogsSchema.parse(req.query);
    const result = await this.service.findAll(filters);

    res.json({
      message: 'Activity logs retrieved successfully',
      data: result.data,
      pagination: {
        total: result.total,
        limit: filters.limit || 50,
        offset: filters.offset || 0,
      },
    });
  };

  getMyLogs = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const logs = await this.service.findByUserId(userId, limit);

    res.json({
      message: 'Activity logs retrieved successfully',
      data: logs,
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const log = await this.service.findById(id);

    res.json({
      message: 'Activity log retrieved successfully',
      data: log,
    });
  };

  cleanup = async (req: Request, res: Response): Promise<void> => {
    const days = req.body.days || 90;
    const deletedCount = await this.service.cleanup(days);

    res.json({
      message: 'Activity logs cleaned up successfully',
      data: {
        deletedCount,
        olderThanDays: days,
      },
    });
  };
}

