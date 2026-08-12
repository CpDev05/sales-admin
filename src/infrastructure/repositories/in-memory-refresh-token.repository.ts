import { Injectable } from '@nestjs/common';

import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';

@Injectable()
export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  private readonly refreshTokens: RefreshToken[] = [];

  async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    this.refreshTokens.push(refreshToken);
    return refreshToken;
  }

  async update(refreshToken: RefreshToken): Promise<RefreshToken> {
    const index = this.refreshTokens.findIndex(
      (storedToken) => storedToken.id === refreshToken.id,
    );

    if (index >= 0) {
      this.refreshTokens[index] = refreshToken;
    }

    return refreshToken;
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return this.refreshTokens.filter((token) => token.userId === userId);
  }

  async revoke(id: string): Promise<void> {
    const token = this.refreshTokens.find(
      (storedToken) => storedToken.id === id,
    );

    if (token) {
      token.revoke(new Date());
    }
  }

  async revokeAllByUser(userId: string): Promise<void> {
    const now = new Date();

    for (const token of this.refreshTokens) {
      if (token.userId === userId && !token.isRevoked) {
        token.revoke(now);
      }
    }
  }
}
