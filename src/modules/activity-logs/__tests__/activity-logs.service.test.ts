import { ActivityLogsService } from '../activity-logs.service';
import { ActivityLogsRepository } from '../activity-logs.repository';

jest.mock('../activity-logs.repository');

describe('ActivityLogsService', () => {
  let service: ActivityLogsService;
  let repository: jest.Mocked<ActivityLogsRepository>;

  beforeEach(() => {
    service = new ActivityLogsService();
    repository = (service as any).repository;
  });

  describe('create', () => {
    it('should create activity log', async () => {
      const logData = {
        userId: 'user-123',
        action: 'USER_LOGIN',
        resource: 'AUTH',
        ipAddress: '127.0.0.1',
      };

      const mockLog = {
        id: 'log-123',
        ...logData,
        createdAt: new Date(),
      };

      repository.create.mockResolvedValue(mockLog as any);

      const result = await service.create(logData);

      expect(result).toEqual(mockLog);
      expect(repository.create).toHaveBeenCalledWith(logData);
    });
  });

  describe('findAll', () => {
    it('should return logs with pagination', async () => {
      const mockLogs = [
        { id: 'log-1', action: 'USER_LOGIN' },
        { id: 'log-2', action: 'USER_LOGOUT' },
      ];

      repository.findAll.mockResolvedValue(mockLogs as any);
      repository.count.mockResolvedValue(2);

      const result = await service.findAll({});

      expect(result.data).toEqual(mockLogs);
      expect(result.total).toBe(2);
    });

    it('should filter logs by userId', async () => {
      const filters = { userId: 'user-123' };
      repository.findAll.mockResolvedValue([]);
      repository.count.mockResolvedValue(0);

      await service.findAll(filters);

      expect(repository.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('findById', () => {
    it('should return log by id', async () => {
      const mockLog = {
        id: 'log-123',
        action: 'USER_LOGIN',
      };

      repository.findById.mockResolvedValue(mockLog as any);

      const result = await service.findById('log-123');

      expect(result).toEqual(mockLog);
    });

    it('should throw error if log not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow('Activity log not found');
    });
  });

  describe('cleanup', () => {
    it('should delete old logs', async () => {
      repository.deleteOlderThan.mockResolvedValue(10);

      const result = await service.cleanup(90);

      expect(result).toBe(10);
      expect(repository.deleteOlderThan).toHaveBeenCalledWith(90);
    });
  });
});

