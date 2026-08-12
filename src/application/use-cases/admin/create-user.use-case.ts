import { Inject, Injectable } from '@nestjs/common';

import { UserDto } from '../../dto/admin.dto';
import { toUserDto } from '../../dto/admin.mapper';
import { DATE_PORT, DatePort } from '../../ports/date.port';
import { HASH_PORT, HashPort } from '../../ports/hash.port';
import { UUID_PORT, UuidPort } from '../../ports/uuid.port';
import { Role } from '../../../domain/entities/role.entity';
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

export interface CreateUserCommand {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleIds?: string[];
}

@Injectable()
export class CreateUserUseCase {
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

  async execute(command: CreateUserCommand): Promise<UserDto> {
    const now = this.dates.now();
    const roleEntities = command.roleIds?.length
      ? await Promise.all(command.roleIds.map((id) => this.roles.findById(id)))
      : [];
    const validRoles = roleEntities.filter(
      (role): role is Role => role !== null,
    );

    const user = new User(this.uuid.generate(), {
      firstName: command.firstName.trim(),
      lastName: command.lastName.trim(),
      email: command.email.trim().toLowerCase(),
      passwordHash: await this.hash.hash(command.password),
      status: UserStatus.ACTIVE,
      roles: validRoles,
      createdAt: now,
      updatedAt: now,
    });

    return toUserDto(await this.users.create(user));
  }
}
