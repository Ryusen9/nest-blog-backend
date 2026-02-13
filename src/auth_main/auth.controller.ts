import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
    Purpose: Login must be public so users can obtain a JWT.
    Guarding it with JWT blocks unauthenticated clients.
  */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signinDto: SignInDto) {
    return await this.authService.validateUser(
      signinDto.email,
      signinDto.password,
    );
  }
}
