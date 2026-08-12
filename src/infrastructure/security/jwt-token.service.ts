import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';

import { TokenPayload, TokenPort } from '../../application/ports/token.port';

@Injectable()
export class JwtTokenService implements TokenPort {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  signAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('jwt.secret'),
      expiresIn: this.config.getOrThrow<string>('jwt.expiresIn') as StringValue,
    });
  }

  signRefreshToken(payload: TokenPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('jwt.refreshSecret'),
      expiresIn: this.config.getOrThrow<string>(
        'jwt.refreshExpiresIn',
      ) as StringValue,
    });
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwt.verifyAsync<TokenPayload>(token, {
        secret: this.config.getOrThrow<string>('jwt.refreshSecret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
