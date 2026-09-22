import { RefreshToken } from '../entities/refresh-token.entity';

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY');

export interface RefreshTokenRepository {
  create(refreshToken: RefreshToken): Promise<RefreshToken>;

  update(refreshToken: RefreshToken): Promise<RefreshToken>;

  findByUserId(userId: string): Promise<RefreshToken[]>;

  revoke(id: string): Promise<void>;

  revokeAllByUser(userId: string): Promise<void>;
}
