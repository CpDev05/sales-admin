import { Inject, Injectable } from '@nestjs/common';

import { PermissionDto } from '../../dto/admin.dto';
import { toPermissionDto } from '../../dto/admin.mapper';
import { DATE_PORT, DatePort } from '../../ports/date.port';
import { UUID_PORT, UuidPort } from '../../ports/uuid.port';
import { Permission } from '../../../domain/entities/permission.entity';
import {
  PERMISSION_REPOSITORY,
  PermissionRepository,
} from '../../../domain/repositories/permission.repository';

export interface CreatePermissionCommand {
  code: string;
  name: string;
  description: string;
  module: string;
}

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: PermissionRepository,
    @Inject(UUID_PORT)
    private readonly uuid: UuidPort,
    @Inject(DATE_PORT)
    private readonly dates: DatePort,
  ) {}

  async execute(command: CreatePermissionCommand): Promise<PermissionDto> {
    const now = this.dates.now();
    const permission = new Permission(this.uuid.generate(), {
      code: command.code,
      name: command.name,
      description: command.description,
      module: command.module,
      createdAt: now,
      updatedAt: now,
    });

    return toPermissionDto(await this.permissions.create(permission));
  }
}
