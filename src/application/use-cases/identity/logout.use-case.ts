import { Inject, Injectable } from '@nestjs/common';

import { HASH_PORT, HashPort } from '../../ports/hash.port';
import { TOKEN_PORT, TokenPort } from '../../ports/token.port';
import {
  REFRESH_TOKEN_REPOSITORY,
  RefreshTokenRepository,
} from '../../../domain/repositories/refresh-token.repository';

export interface LogoutCommand {
  refreshToken: string;
}

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepository,
    @Inject(HASH_PORT)
    private readonly hash: HashPort,
    @Inject(TOKEN_PORT)
    private readonly tokens: TokenPort,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const payload = await this.tokens.verifyRefreshToken(command.refreshToken);
    const savedTokens = await this.refreshTokens.findByUserId(payload.sub);

    for (const token of savedTokens) {
      if (await this.hash.compare(command.refreshToken, token.tokenHash)) {
        await this.refreshTokens.revoke(token.id);
        return;
      }
    }
  }
}
