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

export interface LoginCommand {
  email: string;
  password: string;
  device?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class LoginUseCase {
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

  async execute(command: LoginCommand): Promise<AuthResultDto> {
    const user = await this.users.findByEmail(
      command.email.trim().toLowerCase(),
    );

    if (
      !user ||
      !(await this.hash.compare(command.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

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
    const now = this.dates.now();

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
}
