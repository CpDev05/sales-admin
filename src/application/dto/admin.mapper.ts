//Mapper For Admin Module
// These mappers are used to convert the domain layer entities to the application layer DTOs

import { Permission } from '../../domain/entities/permission.entity';
import { Role } from '../../domain/entities/role.entity';
import { User } from '../../domain/entities/user.entity';
import { PermissionDto, RoleDto, UserDto } from './admin.dto';

export function toPermissionDto(permission: Permission): PermissionDto {
  return {
    id: permission.id,
    code: permission.code,
    name: permission.name,
    description: permission.description,
    module: permission.module,
    createdAt: permission.createdAt,
    updatedAt: permission.updatedAt,
  };
}

export function toRoleDto(role: Role): RoleDto {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions.map(toPermissionDto),
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
}

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    status: user.status,
    roles: user.roles.map(toRoleDto),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
