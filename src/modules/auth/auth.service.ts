import { User } from '@prisma/client';
import { AuthRepository } from './auth.repository';
import { hashPassword, comparePassword } from '../../shared/utils/hash';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../shared/utils/jwt';
import {
  ConflictError,
  UnauthorizedError,
} from '../../shared/errors/AppError';
import redis from '../../shared/config/redis';
import { RegisterDTO, LoginDTO } from './auth.dto';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: RegisterDTO): Promise<{
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
  }> {
    const userExists = await this.authRepository.existsByEmail(data.email);

    if (userExists) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await this.authRepository.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await redis.set(`refresh:${user.id}`, refreshToken, 'EX', 60 * 60 * 24 * 7);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginDTO): Promise<{
    user: Omit<User, 'password'>;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.authRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await redis.set(`refresh:${user.id}`, refreshToken, 'EX', 60 * 60 * 24 * 7);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(token: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const decoded = verifyRefreshToken(token);

      const storedToken = await redis.get(`refresh:${decoded.userId}`);

      if (!storedToken || storedToken !== token) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const user = await this.authRepository.findById(decoded.userId);

      if (!user) {
        throw new UnauthorizedError('User not found');
      }

      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      await redis.set(
        `refresh:${user.id}`,
        newRefreshToken,
        'EX',
        60 * 60 * 24 * 7
      );

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await redis.del(`refresh:${userId}`);
  }
}

