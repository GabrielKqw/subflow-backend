import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';
import { authLimiter } from '../../shared/middlewares/rate-limit.middleware';
import { logActivity } from '../../shared/middlewares/activity-logger.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authLimiter, logActivity('USER_REGISTER', 'AUTH'), authController.register);
router.post('/login', authLimiter, logActivity('USER_LOGIN', 'AUTH'), authController.login);
router.post('/refresh', authLimiter, authController.refresh);
router.post('/logout', authenticate, logActivity('USER_LOGOUT', 'AUTH'), authController.logout);
router.get('/me', authenticate, authController.me);

export default router;

