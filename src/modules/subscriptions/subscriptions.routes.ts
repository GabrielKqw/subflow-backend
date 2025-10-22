import { Router } from 'express';
import { SubscriptionsController } from './subscriptions.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { logActivity } from '../../shared/middlewares/activity-logger.middleware';

const router = Router();
const subscriptionsController = new SubscriptionsController();

router.use(authenticate);

router.post('/', logActivity('SUBSCRIPTION_CREATE', 'SUBSCRIPTION'), subscriptionsController.create);
router.get('/me', subscriptionsController.findMySubscriptions);
router.get('/:id', subscriptionsController.findById);
router.delete('/:id', logActivity('SUBSCRIPTION_CANCEL', 'SUBSCRIPTION'), subscriptionsController.cancel);

router.get('/', authorize('ADMIN'), subscriptionsController.findAll);
router.patch('/:id/activate', authorize('ADMIN'), logActivity('SUBSCRIPTION_ACTIVATE', 'SUBSCRIPTION'), subscriptionsController.activate);
router.patch('/:id/renew', authorize('ADMIN'), logActivity('SUBSCRIPTION_RENEW', 'SUBSCRIPTION'), subscriptionsController.renew);

export default router;

