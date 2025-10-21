import { AuthService } from '../auth.service';
import { AuthRepository } from '../auth.repository';
import { ConflictError, UnauthorizedError } from '../../../shared/errors/AppError';
import * as hashUtils from '../../../shared/utils/hash';
import * as jwtUtils from '../../../shared/utils/jwt';
import redis from '../../../shared/config/redis';

jest.mock('../auth.repository');
jest.mock('../../../shared/utils/hash');
jest.mock('../../../shared/utils/jwt');
jest.mock('../../../shared/config/redis');

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    authService = new AuthService();
    authRepository = (authService as any).authRepository;
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      authRepository.existsByEmail = jest.fn().mockResolvedValue(false);
      authRepository.createUser = jest.fn().mockResolvedValue(mockUser);
      (hashUtils.hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('accessToken');
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');
      (redis.set as jest.Mock).mockResolvedValue('OK');

      const result = await authService.register({
        email: 'test@example.com',
        password: 'Password@123',
        name: 'Test User',
      });

      expect(result.user).not.toHaveProperty('password');
      expect(result.accessToken).toBe('accessToken');
      expect(result.refreshToken).toBe('refreshToken');
    });

    it('should throw ConflictError if email already exists', async () => {
      authRepository.existsByEmail = jest.fn().mockResolvedValue(true);

      await expect(
        authService.register({
          email: 'existing@example.com',
          password: 'Password@123',
          name: 'Test User',
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      authRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
      (hashUtils.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('accessToken');
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');
      (redis.set as jest.Mock).mockResolvedValue('OK');

      const result = await authService.login({
        email: 'test@example.com',
        password: 'Password@123',
      });

      expect(result.user).not.toHaveProperty('password');
      expect(result.accessToken).toBe('accessToken');
    });

    it('should throw UnauthorizedError with invalid email', async () => {
      authRepository.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'Password@123',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError with invalid password', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'USER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      authRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
      (hashUtils.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});

