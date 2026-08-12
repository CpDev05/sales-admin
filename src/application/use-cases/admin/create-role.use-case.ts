import { Inject, Injectable } from '@nestjs/common';

import { RoleDto } from '../../dto/admin.dto';
import { toRoleDto } from '../../dto/admin.mapper';
import { DATE_PORT, DatePort } from '../../ports/date.port';
import { UUID_PORT, UuidPort } from '../../ports/uuid.port';
import { Permission } from '../../../domain/entities/permission.entity';
import { Role } from '../../../domain/entities/role.entity';
import {
  PERMISSION_REPOSITORY,
  PermissionRepository,
} from '../../../domain/repositories/permission.repository';
import {
  ROLE_REPOSITORY,
  RoleRepository,
} from '../../../domain/repositories/role.repository';

export interface CreateRoleCommand {
  name: string;
  description: string;
  permissionIds: string[];
}

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roles: RoleRepository,
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: PermissionRepository,
    @Inject(UUID_PORT)
    private readonly uuid: UuidPort,
    @Inject(DATE_PORT)
    private readonly dates: DatePort,
  ) {}

  async execute(command: CreateRoleCommand): Promise<RoleDto> {
    const permissionEntities = await Promise.all(
      command.permissionIds.map((id) => this.permissions.findById(id)),
    );

    const validPermissions = permissionEntities.filter(
      (permission): permission is Permission => permission !== null,
    );

    const now = this.dates.now();
    const role = new Role(this.uuid.generate(), {
      name: command.name,
      description: command.description,
      permissions: validPermissions,
      createdAt: now,
      updatedAt: now,
    });

    return toRoleDto(await this.roles.create(role));
  }
}
