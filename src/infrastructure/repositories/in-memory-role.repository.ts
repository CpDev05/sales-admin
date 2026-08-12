import { Injectable } from '@nestjs/common';

import { Permission } from '../../domain/entities/permission.entity';
import { Role } from '../../domain/entities/role.entity';
import { RoleRepository } from '../../domain/repositories/role.repository';

@Injectable()
export class InMemoryRoleRepository implements RoleRepository {
  private readonly roles: Role[];

  constructor() {
    const now = new Date();
    const permissions = this.buildBasePermissions(now);

    this.roles = [
      new Role('role-super-admin', {
        name: 'SUPER_ADMIN',
        description: 'Full system owner',
        permissions,
        createdAt: now,
        updatedAt: now,
      }),
      new Role('role-admin', {
        name: 'ADMIN',
        description: 'Business administrator',
        permissions,
        createdAt: now,
        updatedAt: now,
      }),
      new Role('role-vendedor', {
        name: 'VENDEDOR',
        description: 'Seller that creates customer orders',
        permissions: permissions.filter((permission) =>
          permission.code.startsWith('sales.'),
        ),
        createdAt: now,
        updatedAt: now,
      }),
      new Role('role-despachador', {
        name: 'DESPACHADOR',
        description: 'Dispatcher that marks sales as delivered',
        permissions: permissions.filter((permission) =>
          permission.code.startsWith('dispatch.'),
        ),
        createdAt: now,
        updatedAt: now,
      }),
    ];
  }

  async create(role: Role): Promise<Role> {
    this.roles.push(role);
    return role;
  }

  async update(role: Role): Promise<Role> {
    const index = this.roles.findIndex(
      (storedRole) => storedRole.id === role.id,
    );

    if (index >= 0) {
      this.roles[index] = role;
    }

    return role;
  }

  async findById(id: string): Promise<Role | null> {
    return this.roles.find((role) => role.id === id) ?? null;
  }

  async findByName(name: string): Promise<Role | null> {
    const normalizedName = name.trim().toUpperCase();

    return this.roles.find((role) => role.name === normalizedName) ?? null;
  }

  async findAll(): Promise<Role[]> {
    return [...this.roles];
  }

  private buildBasePermissions(now: Date): Permission[] {
    return [
      this.permission(
        'permission-users-manage',
        'users.manage',
        'Manage users',
        'identity',
        now,
      ),
      this.permission(
        'permission-sales-manage',
        'sales.manage',
        'Manage sales',
        'sales',
        now,
      ),
      this.permission(
        'permission-dispatch-manage',
        'dispatch.manage',
        'Manage dispatch',
        'sales',
        now,
      ),
      this.permission(
        'permission-inventory-read',
        'inventory.read',
        'Read inventory',
        'inventory',
        now,
      ),
    ];
  }

  private permission(
    id: string,
    code: string,
    name: string,
    module: string,
    now: Date,
  ): Permission {
    return new Permission(id, {
      code,
      name,
      description: name,
      module,
      createdAt: now,
      updatedAt: now,
    });
  }
}
