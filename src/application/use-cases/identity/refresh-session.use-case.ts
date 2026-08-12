import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthResultDto } from '../../dto/auth-result.dto';
import { toAuthUserDto } from '../../dto/auth-user.mapper';
import { DATE_PORT, DatePort } from '../../ports/date.port';
import { HASH_PORT, HashPort } from '../../ports/hash.port';
import { TOKEN_PORT, TokenPort } from '../../ports/token.port';
import { UUID_PORT, UuidPort } from '../../ports/uuid.port';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepository,
} from '../../../domain/repositories/refresh-token.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../domain/repositories/user.repository';

export interface RefreshSessionCommand {
  refreshToken: string;
  device?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class RefreshSessionUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
    @Inject(HASH_PORT)
    private readonly hash: HashPort,
    @Inject(TOKEN_PORT)
    private readonly tokens: TokenPort,
    @Inject(UUID_PORT)
    private readonly uuid: UuidPort,
    @Inject(DATE_PORT)
    private readonly dates: DatePort,
  ) {}

  async execute(command: RefreshSessionCommand): Promise<AuthResultDto> {
    const payload = await this.tokens.verifyRefreshToken(command.refreshToken);
    const user = await this.users.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const savedToken = await this.findSavedToken(user.id, command.refreshToken);

    if (!savedToken || savedToken.isRevoked || savedToken.isExpired) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const now = this.dates.now();
    savedToken.revoke(now);
    await this.refreshTokens.update(savedToken);

    const accessToken = await this.tokens.signAccessToken({
      sub: user.id,
      email: user.email,
      roles: user.roleNames,
    });
    const refreshToken = await this.tokens.signRefreshToken({
      sub: user.id,
      email: user.email,
      roles: user.roleNames,
    });

    await this.refreshTokens.create(
      new RefreshToken(this.uuid.generate(), {
        tokenHash: await this.hash.hash(refreshToken),
        userId: user.id,
        expiresAt: this.dates.addDays(now, 7),
        device: command.device,
        ipAddress: command.ipAddress,
        userAgent: command.userAgent,
        createdAt: now,
      }),
    );

    return {
      user: toAuthUserDto(user),
      accessToken,
      refreshToken,
    };
  }

  private async findSavedToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshToken | null> {
    const tokens = await this.refreshTokens.findByUserId(userId);

    for (const token of tokens) {
      if (await this.hash.compare(refreshToken, token.tokenHash)) {
        return token;
      }
    }

    return null;
  }
}
