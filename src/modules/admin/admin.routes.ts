import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate, requireAdmin } from '../../shared/middlewares/auth.middleware';

const router = Router();
const controller = new AdminController();

router.use(authenticate, requireAdmin);

router.get('/dashboard', controller.getDashboardStats);
router.get('/users', controller.getAllUsers);
router.get('/users/:id', controller.getUserById);
router.patch('/users/:id', controller.updateUser);
router.patch('/users/:id/role', controller.updateUserRole);
router.delete('/users/:id', controller.deleteUser);

export default router;

