//Exit DTOs For Admin Module
// These DTOs are used to return data from the application layer to the presentation layer.

export interface PermissionDto {
  id: string;
  code: string;
  name: string;
  description: string;
  module: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleDto {
  id: string;
  name: string;
  description: string;
  permissions: PermissionDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roles: RoleDto[];
  createdAt: Date;
  updatedAt: Date;
}
