import { Entity } from './entity';
import { User } from './user.entity';

export interface RefreshTokenProps {
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  userId: User;
  device?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export class RefreshToken extends Entity<RefreshTokenProps> {
  constructor(id: string, props: RefreshTokenProps) {
    super(id, props);
  }

  get tokenHash(): string {
    return this.props.tokenHash;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get revokedAt(): Date {
    return this.props.revokedAt;
  }

  get userId(): User {
    return this.props.userId;
  }

  get device(): string {
    return this.props.device;
  }

  get ipAddress(): string {
    return this.props.ipAddress;
  }

  get userAgent(): string {
    return this.props.userAgent;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
