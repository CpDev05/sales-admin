import { Injectable } from '@nestjs/common';

import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/entities/role.entity';
import { Permission } from '../../domain/entities/permission.entity';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const stored = await this.prisma.user.create({
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash: user.passwordHash,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: {
          create: user.roles.map((role) => ({
            role: {
              connect: { id: role.id },
            },
          })),
        },
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.toDomain(stored);
  }

  async update(user: User): Promise<User> {
    const stored = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        passwordHash: user.passwordHash,
        status: user.status,
        updatedAt: user.updatedAt,
        roles: {
          deleteMany: {},
          create: user.roles.map((role) => ({
            role: {
              connect: { id: role.id },
            },
          })),
        },
      },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return this.toDomain(stored);
  }

  async findById(id: string): Promise<User | null> {
    const stored = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return stored ? this.toDomain(stored) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const stored = await this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return stored ? this.toDomain(stored) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return users.map((stored) => this.toDomain(stored));
  }

  private toDomain(stored: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    roles?: {
      role: {
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
      };
    }[];
  }): User {
    return new User(stored.id, {
      firstName: stored.firstName,
      lastName: stored.lastName,
      email: stored.email,
      passwordHash: stored.passwordHash,
      status: stored.status as UserStatus,
      roles: (stored.roles ?? []).map((relation) =>
        this.toRoleDomain(relation.role),
      ),
      createdAt: stored.createdAt,
      updatedAt: stored.updatedAt,
    });
  }

  private toRoleDomain(role: {
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
