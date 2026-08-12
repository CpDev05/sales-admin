import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Request } from 'express';

import {
  AuthResultDto,
  AuthUserDto,
} from '../../application/dto/auth-result.dto';
import { TokenPayload } from '../../application/ports/token.port';
import { GetAuthUserUseCase } from '../../application/use-cases/identity/get-auth-user.use-case';
import { LoginUseCase } from '../../application/use-cases/identity/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/identity/logout.use-case';
import { RefreshSessionUseCase } from '../../application/use-cases/identity/refresh-session.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/identity/register-user.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

class RegisterRequestDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

class LoginRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  device?: string;
}

class RefreshTokenRequestDto {
  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsString()
  device?: string;
}

type AuthenticatedRequest = Request & {
  user: TokenPayload;
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUseCase,
    private readonly refreshSession: RefreshSessionUseCase,
    private readonly logoutUser: LogoutUseCase,
    private readonly getAuthUser: GetAuthUserUseCase,
  ) {}

  @Post('register')
  register(@Body() body: RegisterRequestDto): Promise<AuthUserDto> {
    return this.registerUser.execute(body);
  }

  @HttpCode(200)
  @Post('login')
  login(
    @Body() body: LoginRequestDto,
    @Req() request: Request,
  ): Promise<AuthResultDto> {
    return this.loginUser.execute({
      ...body,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @HttpCode(200)
  @Post('refresh')
  refresh(
    @Body() body: RefreshTokenRequestDto,
    @Req() request: Request,
  ): Promise<AuthResultDto> {
    return this.refreshSession.execute({
      ...body,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    });
  }

  @HttpCode(204)
  @Post('logout')
  async logout(@Body() body: RefreshTokenRequestDto): Promise<void> {
    await this.logoutUser.execute(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() request: AuthenticatedRequest): Promise<AuthUserDto> {
    return this.getAuthUser.execute(request.user.sub);
  }
}
