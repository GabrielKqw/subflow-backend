import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const logActivity = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return next();
      }

      const resourceId = req.params.id || req.body.id || undefined;
      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || undefined;
      const userAgent = req.headers['user-agent'] || undefined;

      const originalSend = res.json;
      res.json = function (data: any) {
        res.json = originalSend;

        if (res.statusCode >= 200 && res.statusCode < 400) {
          prisma.activityLog
            .create({
              data: {
                userId,
                action,
                resource,
                resourceId,
                details: {
                  method: req.method,
                  path: req.path,
                  statusCode: res.statusCode,
                },
                ipAddress,
                userAgent,
              },
            })
            .catch((error) => {
              console.error('Failed to log activity:', error);
            });
        }

        return res.json(data);
      };

      next();
    } catch (error) {
      next();
    }
  };
};

