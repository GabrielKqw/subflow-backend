import { Router } from 'express';
import { PlansController } from './plans.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';
import { logActivity } from '../../shared/middlewares/activity-logger.middleware';

const router = Router();
const plansController = new PlansController();

router.get('/', plansController.findAll);
router.get('/:id', plansController.findById);

router.post('/', authenticate, authorize('ADMIN'), logActivity('PLAN_CREATE', 'PLAN'), plansController.create);
router.put('/:id', authenticate, authorize('ADMIN'), logActivity('PLAN_UPDATE', 'PLAN'), plansController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), logActivity('PLAN_DELETE', 'PLAN'), plansController.delete);
router.patch('/:id/toggle', authenticate, authorize('ADMIN'), logActivity('PLAN_TOGGLE', 'PLAN'), plansController.toggleActive);

export default router;

