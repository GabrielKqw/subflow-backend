import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.dto';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    const data = registerSchema.parse(req.body);

    const result = await this.authService.register(data);

    res.status(201).json({
      message: 'User registered successfully',
      data: result,
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const data = loginSchema.parse(req.body);

    const result = await this.authService.login(data);

    res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = refreshTokenSchema.parse(req.body);

    const result = await this.authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      message: 'Token refreshed successfully',
      data: result,
    });
  };

  logout = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await this.authService.logout(req.user.userId);

    res.status(200).json({
      message: 'Logout successful',
    });
  };

  me = async (req: AuthRequest, res: Response): Promise<void> => {
    res.status(200).json({
      message: 'User retrieved successfully',
      data: req.user,
    });
  };
}

