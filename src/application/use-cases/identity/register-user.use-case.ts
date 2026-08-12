import {
  Inject,
  Injectable,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

import { HASH_PORT, HashPort } from '../../ports/hash.port';
import { UUID_PORT, UuidPort } from '../../ports/uuid.port';
import { DATE_PORT, DatePort } from '../../ports/date.port';
import { User } from '../../../domain/entities/user.entity';
import { UserStatus } from '../../../domain/enums/user-status.enum';
import {
  ROLE_REPOSITORY,
  RoleRepository,
} from '../../../domain/repositories/role.repository';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../domain/repositories/user.repository';
import { toAuthUserDto } from '../../dto/auth-user.mapper';
import { AuthUserDto } from '../../dto/auth-result.dto';

export interface RegisterUserCommand {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly roles: RoleRepository,
    @Inject(HASH_PORT)
    private readonly hash: HashPort,
    @Inject(UUID_PORT)
    private readonly uuid: UuidPort,
    @Inject(DATE_PORT)
    private readonly dates: DatePort,
  ) {}

  async execute(command: RegisterUserCommand): Promise<AuthUserDto> {
    const email = command.email.trim().toLowerCase();
    const existingUser = await this.users.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const hasUsers = (await this.users.findAll()).length > 0;

    if (hasUsers) {
      throw new ForbiddenException(
        'User registration is only available for initial setup',
      );
    }

    const superAdminRole = await this.roles.findByName('SUPER_ADMIN');
    const validRoles = superAdminRole ? [superAdminRole] : [];

    const now = this.dates.now();
    const user = new User(this.uuid.generate(), {
      firstName: command.firstName.trim(),
      lastName: command.lastName.trim(),
      email,
      passwordHash: await this.hash.hash(command.password),
      status: UserStatus.ACTIVE,
      roles: validRoles,
      createdAt: now,
      updatedAt: now,
    });

    return toAuthUserDto(await this.users.create(user));
  }
}
