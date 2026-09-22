import { Entity } from './entity';
import { Role } from './role.entity';
import { UserStatus } from '../enums/user-status.enum';

export interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  status: UserStatus;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  constructor(id: string, props: UserProps) {
    super(id, props);
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get roles(): Role[] {
    return this.props.roles;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get roleNames(): string[] {
    return this.props.roles.map((role) => role.name);
  }

  get isActive(): boolean {
    return this.props.status === UserStatus.ACTIVE;
  }
}
