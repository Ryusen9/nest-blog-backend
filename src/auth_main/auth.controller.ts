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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import type { Request, Response } from 'express';
import type { RequestWithUser } from './auth-guard/auth.guard';
import { AuthGuard } from './auth-guard/auth.guard';
import {
  AuthMeResponseDto,
  AuthTokenResponseDto,
  LogoutResponseDto,
} from './dto/auth.response.dto';
import { ApiErrorResponseDto } from 'src/global-dto/api-error.response.dto';

const refreshCookieHeader = {
  description:
    'refresh_token=<jwt>; HttpOnly; SameSite=Lax; Max-Age=604800; Secure in production',
  schema: { type: 'string' },
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
    Purpose: Login must be public so users can obtain a JWT.
    Guarding it with JWT blocks unauthenticated clients.
  */
  @ApiOperation({
    summary: 'Log in',
    description:
      'Checks the email and password, stores a hash of a new refresh token, and returns an access token. The refresh token is set as an httpOnly cookie named refresh_token (7 days, SameSite=Lax, Secure in production).',
  })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    type: AuthTokenResponseDto,
    description:
      'Access token for the response body. The refresh token is only in the Set-Cookie header.',
    headers: { 'Set-Cookie': refreshCookieHeader },
  })
  @ApiBadRequestResponse({
    type: ApiErrorResponseDto,
    description:
      'The email is invalid, or the password is shorter than 6 characters.',
  })
  @ApiUnauthorizedResponse({
    type: ApiErrorResponseDto,
    description: 'No user has this email, or the password does not match.',
  })
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

  @ApiOperation({
    summary: 'Current user',
    description:
      'Returns the profile for the access token. Requires Authorization: Bearer <access_token>.',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ type: AuthMeResponseDto })
  @ApiUnauthorizedResponse({
    type: ApiErrorResponseDto,
    description:
      'The bearer token is missing or invalid, or that user no longer exists.',
  })
  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Req() request: RequestWithUser) {
    const userId = request.user?.sub;
    if (!userId) throw new UnauthorizedException('User not authenticated');
    return this.authService.me(userId);
  }

  @ApiOperation({
    summary: 'Refresh tokens',
    description:
      'Reads the refresh_token cookie, checks it against the stored hash, and rotates both tokens. The new refresh token replaces the cookie.',
  })
  @ApiCookieAuth('refresh_token')
  @ApiOkResponse({
    type: AuthTokenResponseDto,
    description:
      'New access token. The cookie is replaced with a new refresh token.',
    headers: { 'Set-Cookie': refreshCookieHeader },
  })
  @ApiUnauthorizedResponse({
    type: ApiErrorResponseDto,
    description:
      'The refresh_token cookie is missing, invalid, expired, or no longer matches the stored hash.',
  })
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

  @ApiOperation({
    summary: 'Log out',
    description:
      'Clears the refresh_token cookie. When the cookie is present and valid, the stored refresh-token hash is removed. A missing cookie still returns success.',
  })
  @ApiOkResponse({
    type: LogoutResponseDto,
    headers: {
      'Set-Cookie': {
        description:
          'Clears refresh_token. HttpOnly; SameSite=Lax; Secure in production.',
        schema: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    type: ApiErrorResponseDto,
    description:
      'The refresh_token cookie is present but invalid, expired, or no longer matches the stored hash.',
  })
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
