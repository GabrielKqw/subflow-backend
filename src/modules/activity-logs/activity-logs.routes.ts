import { Router } from 'express';
import { ActivityLogsController } from './activity-logs.controller';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware';

const router = Router();
const controller = new ActivityLogsController();

router.get('/me', authenticate, controller.getMyLogs);

router.get('/', authenticate, requireAdmin, controller.getAll);
router.get('/:id', authenticate, requireAdmin, controller.getById);
router.post('/cleanup', authenticate, requireAdmin, controller.cleanup);

export default router;

