import { Inject, Injectable } from '@nestjs/common';

import { RoleDto } from '../../dto/admin.dto';
import { toRoleDto } from '../../dto/admin.mapper';
import {
  ROLE_REPOSITORY,
  RoleRepository,
} from '../../../domain/repositories/role.repository';

@Injectable()
export class ListRolesUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roles: RoleRepository,
  ) {}

  async execute(): Promise<RoleDto[]> {
    const roles = await this.roles.findAll();

    return roles.map(toRoleDto);
  }
}
