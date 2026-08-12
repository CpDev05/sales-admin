import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

import {
  PermissionDto,
  RoleDto,
  UserDto,
} from '../../application/dto/admin.dto';
import { CreatePermissionUseCase } from '../../application/use-cases/admin/create-permission.use-case';
import { CreateRoleUseCase } from '../../application/use-cases/admin/create-role.use-case';
import { CreateUserUseCase } from '../../application/use-cases/admin/create-user.use-case';
import { ListPermissionsUseCase } from '../../application/use-cases/admin/list-permissions.use-case';
import { ListRolesUseCase } from '../../application/use-cases/admin/list-roles.use-case';
import { ListUsersUseCase } from '../../application/use-cases/admin/list-users.use-case';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

class CreatePermissionDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  module: string;
}

class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  permissions: string[];
}

class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsArray()
  roles?: string[];
}

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private readonly listPermissionsUseCase: ListPermissionsUseCase,
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Get('permissions')
  listPermissions(): Promise<PermissionDto[]> {
    return this.listPermissionsUseCase.execute();
  }

  @Post('permissions')
  createPermission(@Body() body: CreatePermissionDto): Promise<PermissionDto> {
    return this.createPermissionUseCase.execute(body);
  }

  @Get('roles')
  listRoles(): Promise<RoleDto[]> {
    return this.listRolesUseCase.execute();
  }

  @Post('roles')
  createRole(@Body() body: CreateRoleDto): Promise<RoleDto> {
    return this.createRoleUseCase.execute({
      name: body.name,
      description: body.description,
      permissionIds: body.permissions,
    });
  }

  @Get('users')
  listUsers(): Promise<UserDto[]> {
    return this.listUsersUseCase.execute();
  }

  @Post('users')
  createUser(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.createUserUseCase.execute({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      roleIds: body.roles,
    });
  }
}
