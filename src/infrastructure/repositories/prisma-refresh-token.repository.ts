import { Injectable } from '@nestjs/common';

import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    const stored = await this.prisma.refreshToken.create({
      data: {
        id: refreshToken.id,
        tokenHash: refreshToken.tokenHash,
        expiresAt: refreshToken.expiresAt,
        revokedAt: refreshToken.revokedAt,
        userId: refreshToken.userId,
        device: refreshToken.device,
        ipAddress: refreshToken.ipAddress,
        userAgent: refreshToken.userAgent,
        createdAt: refreshToken.createdAt,
      },
      include: {
        user: true,
      },
    });

    return this.toDomain(stored);
  }

  async update(refreshToken: RefreshToken): Promise<RefreshToken> {
    const stored = await this.prisma.refreshToken.update({
      where: { id: refreshToken.id },
      data: {
        tokenHash: refreshToken.tokenHash,
        expiresAt: refreshToken.expiresAt,
        revokedAt: refreshToken.revokedAt,
        userId: refreshToken.userId,
        device: refreshToken.device,
        ipAddress: refreshToken.ipAddress,
        userAgent: refreshToken.userAgent,
      },
      include: {
        user: true,
      },
    });

    return this.toDomain(stored);
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });

    return tokens.map((stored) => this.toDomain(stored));
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async revokeAllByUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  private toDomain(stored: {
    id: string;
    tokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    userId: string;
    device: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
  }): RefreshToken {
    return new RefreshToken(stored.id, {
      tokenHash: stored.tokenHash,
      expiresAt: stored.expiresAt,
      revokedAt: stored.revokedAt ?? undefined,
      userId: stored.userId,
      device: stored.device ?? undefined,
      ipAddress: stored.ipAddress ?? undefined,
      userAgent: stored.userAgent ?? undefined,
      createdAt: stored.createdAt,
    });
  }
}
