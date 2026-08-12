import { Injectable } from '@nestjs/common';

import { Permission } from '../../domain/entities/permission.entity';
import { PermissionRepository } from '../../domain/repositories/permission.repository';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class PrismaPermissionRepository implements PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(permission: Permission): Promise<Permission> {
    const stored = await this.prisma.permission.create({
      data: {
        id: permission.id,
        code: permission.code,
        name: permission.name,
        description: permission.description,
        module: permission.module,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt,
      },
    });

    return this.toDomain(stored);
  }

  async update(permission: Permission): Promise<Permission> {
    const stored = await this.prisma.permission.update({
      where: { id: permission.id },
      data: {
        code: permission.code,
        name: permission.name,
        description: permission.description,
        module: permission.module,
        updatedAt: permission.updatedAt,
      },
    });

    return this.toDomain(stored);
  }

  async findById(id: string): Promise<Permission | null> {
    const stored = await this.prisma.permission.findUnique({ where: { id } });
    return stored ? this.toDomain(stored) : null;
  }

  async findByCode(code: string): Promise<Permission | null> {
    const stored = await this.prisma.permission.findUnique({ where: { code } });
    return stored ? this.toDomain(stored) : null;
  }

  async findAll(): Promise<Permission[]> {
    const stored = await this.prisma.permission.findMany();
    return stored.map((permission) => this.toDomain(permission));
  }

  private toDomain(stored: {
    id: string;
    code: string;
    name: string;
    description: string;
    module: string;
    createdAt: Date;
    updatedAt: Date;
  }): Permission {
    return new Permission(stored.id, {
      code: stored.code,
      name: stored.name,
      description: stored.description,
      module: stored.module,
      createdAt: stored.createdAt,
      updatedAt: stored.updatedAt,
    });
  }
}
