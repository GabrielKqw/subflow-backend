import { Router } from 'express';
import { PaymentsController } from './payments.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { logActivity } from '../../shared/middlewares/activity-logger.middleware';

const router = Router();
const paymentsController = new PaymentsController();

router.use(authenticate);

router.post('/initiate', logActivity('PAYMENT_INITIATE', 'PAYMENT'), paymentsController.initiatePayment);
router.get('/history', paymentsController.findMyPayments);
router.get('/:id', paymentsController.findById);

router.get('/', authorize('ADMIN'), paymentsController.findAll);
router.patch('/:id/status', authorize('ADMIN'), logActivity('PAYMENT_STATUS_UPDATE', 'PAYMENT'), paymentsController.updateStatus);
router.get('/admin/stats', authorize('ADMIN'), paymentsController.getStats);

export default router;

