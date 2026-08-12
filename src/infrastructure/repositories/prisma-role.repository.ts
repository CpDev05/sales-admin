import { Injectable } from '@nestjs/common';

import { Permission } from '../../domain/entities/permission.entity';
import { Role } from '../../domain/entities/role.entity';
import { RoleRepository } from '../../domain/repositories/role.repository';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class PrismaRoleRepository implements RoleRepository {
  constructor(private readonly prisma: PrismaService) {
    void this.seedBaseData();
  }

  async create(role: Role): Promise<Role> {
    const stored = await this.prisma.role.create({
      data: {
        id: role.id,
        name: role.name,
        description: role.description,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
        permissions: {
          create: role.permissions.map((permission) => ({
            permission: {
              connect: { id: permission.id },
            },
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return this.toDomain(stored);
  }

  async update(role: Role): Promise<Role> {
    const stored = await this.prisma.role.update({
      where: { id: role.id },
      data: {
        name: role.name,
        description: role.description,
        updatedAt: role.updatedAt,
        permissions: {
          deleteMany: {},
          create: role.permissions.map((permission) => ({
            permission: {
              connect: { id: permission.id },
            },
          })),
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return this.toDomain(stored);
  }

  async findById(id: string): Promise<Role | null> {
    const stored = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return stored ? this.toDomain(stored) : null;
  }

  async findByName(name: string): Promise<Role | null> {
    const stored = await this.prisma.role.findUnique({
      where: { name },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return stored ? this.toDomain(stored) : null;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return roles.map((role) => this.toDomain(role));
  }

  private async seedBaseData(): Promise<void> {
    const now = new Date();
    const basePermissions = [
      {
        id: 'permission-users-manage',
        code: 'users.manage',
        name: 'Manage users',
        description: 'Manage users',
        module: 'identity',
      },
      {
        id: 'permission-sales-manage',
        code: 'sales.manage',
        name: 'Manage sales',
        description: 'Manage sales',
        module: 'sales',
      },
      {
        id: 'permission-dispatch-manage',
        code: 'dispatch.manage',
        name: 'Manage dispatch',
        description: 'Manage dispatch',
        module: 'sales',
      },
      {
        id: 'permission-inventory-read',
        code: 'inventory.read',
        name: 'Read inventory',
        description: 'Read inventory',
        module: 'inventory',
      },
    ];

    const persistedPermissions = await Promise.all(
      basePermissions.map((permission) =>
        this.prisma.permission.upsert({
          where: { id: permission.id },
          update: permission,
          create: {
            ...permission,
            createdAt: now,
            updatedAt: now,
          },
        }),
      ),
    );

    const roles = [
      {
        id: 'role-super-admin',
        name: 'SUPER_ADMIN',
        description: 'Full system owner',
      },
      {
        id: 'role-admin',
        name: 'ADMIN',
        description: 'Business administrator',
      },
      {
        id: 'role-vendedor',
        name: 'VENDEDOR',
        description: 'Seller that creates customer orders',
      },
      {
        id: 'role-despachador',
        name: 'DESPACHADOR',
        description: 'Dispatcher that marks sales as delivered',
      },
    ];

    for (const role of roles) {
      await this.prisma.role.upsert({
        where: { id: role.id },
        update: {
          name: role.name,
          description: role.description,
          updatedAt: now,
        },
        create: {
          ...role,
          createdAt: now,
          updatedAt: now,
        },
      });
    }

    const superAdmin = await this.prisma.role.findUnique({
      where: { id: 'role-super-admin' },
    });

    if (superAdmin) {
      await this.prisma.rolePermission.createMany({
        data: persistedPermissions.map((permission) => ({
          roleId: superAdmin.id,
          permissionId: permission.id,
        })),
        skipDuplicates: true,
      });
    }
  }

  private toDomain(role: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    permissions: {
      permission: {
        id: string;
        code: string;
        name: string;
        description: string;
        module: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }[];
  }): Role {
    return new Role(role.id, {
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((entry) =>
        this.toPermissionDomain(entry.permission),
      ),
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    });
  }

  private toPermissionDomain(permission: {
    id: string;
    code: string;
    name: string;
    description: string;
    module: string;
    createdAt: Date;
    updatedAt: Date;
  }): Permission {
    return new Permission(permission.id, {
      code: permission.code,
      name: permission.name,
      description: permission.description,
      module: permission.module,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    });
  }
}
