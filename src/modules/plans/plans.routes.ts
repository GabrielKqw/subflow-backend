import { Router } from 'express';
import { PlansController } from './plans.controller';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware';

const router = Router();
const plansController = new PlansController();

router.get('/', plansController.findAll);
router.get('/:id', plansController.findById);

router.post('/', authenticate, authorize('ADMIN'), plansController.create);
router.put('/:id', authenticate, authorize('ADMIN'), plansController.update);
router.delete('/:id', authenticate, authorize('ADMIN'), plansController.delete);
router.patch('/:id/toggle', authenticate, authorize('ADMIN'), plansController.toggleActive);

export default router;

