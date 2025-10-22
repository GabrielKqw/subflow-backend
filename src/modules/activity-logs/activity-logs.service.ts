import { ActivityLogsRepository } from './activity-logs.repository';
import { CreateActivityLogDTO, FilterActivityLogsDTO } from './activity-logs.dto';
import { ActivityLog } from '@prisma/client';
import { AppError } from '../../shared/errors/AppError';

export class ActivityLogsService {
  private repository: ActivityLogsRepository;

  constructor() {
    this.repository = new ActivityLogsRepository();
  }

  async create(data: CreateActivityLogDTO): Promise<ActivityLog> {
    return this.repository.create(data);
  }

  async findAll(filters: FilterActivityLogsDTO): Promise<{ data: ActivityLog[]; total: number }> {
    const [data, total] = await Promise.all([
      this.repository.findAll(filters),
      this.repository.count(filters),
    ]);

    return { data, total };
  }

  async findByUserId(userId: string, limit = 50): Promise<ActivityLog[]> {
    return this.repository.findByUserId(userId, limit);
  }

  async findById(id: string): Promise<ActivityLog> {
    const log = await this.repository.findById(id);

    if (!log) {
      throw new AppError('Activity log not found', 404);
    }

    return log;
  }

  async cleanup(days = 90): Promise<number> {
    return this.repository.deleteOlderThan(days);
  }
}

