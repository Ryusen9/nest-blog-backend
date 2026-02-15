import { JwtService } from '@nestjs/jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';

type JwtPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}
  async validateUser(
    email: string,
    password: string,
  ): Promise<{ id: number; accessToken: string; refreshToken: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    const isPasswordValid = await this.userService.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
    const tokens = this.signTokens(user.id, user.email);
    // Store a hash of the refresh token for rotation and reuse detection.
    await this.userService.setCurrentRefreshToken(user.id, tokens.refreshToken);
    return { id: user.id, ...tokens };
  }

  async refreshTokens(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    const userId = payload.sub;

    const isValid = await this.userService.isRefreshTokenValid(
      userId,
      refreshToken,
    );
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    const tokens = this.signTokens(userId, payload.email);
    // Rotate refresh token by storing the new hash.
    await this.userService.setCurrentRefreshToken(userId, tokens.refreshToken);
    return { id: userId, ...tokens };
  }

  async revokeRefreshToken(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    const userId = payload.sub;
    const isValid = await this.userService.isRefreshTokenValid(
      userId,
      refreshToken,
    );
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');
    // Clear the stored hash so this refresh token can never be reused.
    await this.userService.removeRefreshToken(userId);
    return userId;
  }

  async logout(userId: number) {
    await this.userService.removeRefreshToken(userId);
  }

  private signTokens(userId: number, email: string) {
    const payload: JwtPayload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
    return { accessToken, refreshToken };
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.refreshTokenConfig.secret as string,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
