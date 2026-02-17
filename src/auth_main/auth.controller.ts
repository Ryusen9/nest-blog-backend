import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import type { Request, Response } from 'express';
import type { RequestWithUser } from './auth-guard/auth.guard';
import { AuthGuard } from './auth-guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
    Purpose: Login must be public so users can obtain a JWT.
    Guarding it with JWT blocks unauthenticated clients.
  */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() signinDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.validateUser(
      signinDto.email,
      signinDto.password,
    );
    // Set the refresh token in an httpOnly cookie for rotation flow.
    response.cookie('refresh_token', result.refreshToken, this.refreshCookie());
    return { id: result.id, access_token: result.accessToken };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Req() request: RequestWithUser) {
    const userId = request.user?.sub;
    if (!userId) throw new UnauthorizedException('User not authenticated');
    return this.authService.me(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }
    const result = await this.authService.refreshTokens(refreshToken);
    // Rotate the refresh token on every refresh.
    response.cookie('refresh_token', result.refreshToken, this.refreshCookie());
    return { id: result.id, access_token: result.accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token as string | undefined;
    if (refreshToken) {
      // Validate and revoke refresh token without rotation.
      await this.authService.revokeRefreshToken(refreshToken);
    }
    response.clearCookie('refresh_token', this.refreshCookie());
    return { message: 'Logged out' };
  }

  private refreshCookie() {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
  }
}
