import { Inject, Injectable } from '@nestjs/common';

import { PermissionDto } from '../../dto/admin.dto';
import { toPermissionDto } from '../../dto/admin.mapper';
import {
  PERMISSION_REPOSITORY,
  PermissionRepository,
} from '../../../domain/repositories/permission.repository';

@Injectable()
export class ListPermissionsUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: PermissionRepository,
  ) {}

  async execute(): Promise<PermissionDto[]> {
    const permissions = await this.permissions.findAll();

    return permissions.map(toPermissionDto);
  }
}
