import { Router } from 'express';
import { PaymentsController } from './payments.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';

const router = Router();
const paymentsController = new PaymentsController();

router.use(authenticate);

router.post('/initiate', paymentsController.initiatePayment);
router.get('/history', paymentsController.findMyPayments);
router.get('/:id', paymentsController.findById);

router.get('/', authorize('ADMIN'), paymentsController.findAll);
router.patch('/:id/status', authorize('ADMIN'), paymentsController.updateStatus);
router.get('/admin/stats', authorize('ADMIN'), paymentsController.getStats);

export default router;

