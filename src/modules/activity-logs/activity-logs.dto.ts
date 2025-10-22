import { z } from 'zod';

export const createActivityLogSchema = z.object({
  userId: z.string(),
  action: z.string().min(1, 'Action is required'),
  resource: z.string().min(1, 'Resource is required'),
  resourceId: z.string().optional(),
  details: z.any().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export const filterActivityLogsSchema = z.object({
  userId: z.string().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional(),
});

export type CreateActivityLogDTO = z.infer<typeof createActivityLogSchema>;
export type FilterActivityLogsDTO = z.infer<typeof filterActivityLogsSchema>;

