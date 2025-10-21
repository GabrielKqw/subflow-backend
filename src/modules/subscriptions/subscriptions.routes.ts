import { Router } from 'express';
import { SubscriptionsController } from './subscriptions.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';

const router = Router();
const subscriptionsController = new SubscriptionsController();

router.use(authenticate);

router.post('/', subscriptionsController.create);
router.get('/me', subscriptionsController.findMySubscriptions);
router.get('/:id', subscriptionsController.findById);
router.delete('/:id', subscriptionsController.cancel);

router.get('/', authorize('ADMIN'), subscriptionsController.findAll);
router.patch('/:id/activate', authorize('ADMIN'), subscriptionsController.activate);
router.patch('/:id/renew', authorize('ADMIN'), subscriptionsController.renew);

export default router;

