import { RefreshToken } from '../entities/refresh-token.entity';

export interface RefreshTokenRepository {
  create(refreshToken: RefreshToken): Promise<RefreshToken>;

  findByToken(token: string): Promise<RefreshToken | null>;

  revoke(id: string): Promise<void>;

  revokeAllByUser(userId: string): Promise<void>;
}
