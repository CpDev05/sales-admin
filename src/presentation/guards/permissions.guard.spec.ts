import { describe, expect, it } from '@jest/globals';
import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Permission } from '../../domain/entities/permission.entity';
import { Role } from '../../domain/entities/role.entity';
import { User } from '../../domain/entities/user.entity';
import { UserStatus } from '../../domain/enums/user-status.enum';
import { UserRepository } from '../../domain/repositories/user.repository';
import { RequirePermissions } from '../decorators/require-permissions.decorator';
import { PermissionsGuard } from './permissions.guard';

class FakeUserRepository implements UserRepository {
  constructor(private readonly user: User | null) {}

  async create(user: User): Promise<User> {
    return user;
  }

  async update(user: User): Promise<User> {
    return user;
  }

  async findById(): Promise<User | null> {
    return this.user;
  }

  async findByEmail(): Promise<User | null> {
    return this.user;
  }

  async findAll(): Promise<User[]> {
    return this.user ? [this.user] : [];
  }
}

function buildUser(permissionCodes: string[]): User {
  const now = new Date();
  const permissions = permissionCodes.map(
    (code) =>
      new Permission(`permission-${code}`, {
        code,
        name: code,
        description: code,
        module: 'test',
        createdAt: now,
        updatedAt: now,
      }),
  );
  const role = new Role('role-test', {
    name: 'TEST_ROLE',
    description: 'Test role',
    permissions,
    createdAt: now,
    updatedAt: now,
  });

  return new User('user-1', {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.com',
    passwordHash: 'hash',
    status: UserStatus.ACTIVE,
    roles: [role],
    createdAt: now,
    updatedAt: now,
  });
}

function mockContext(required: string[] | undefined): {
  context: ExecutionContext;
  setUser: (user: unknown) => void;
} {
  @RequirePermissions(...(required ?? []))
  class TestController {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    handler(): void {}
  }

  const handler = TestController.prototype.handler;
  let user: unknown = { sub: 'user-1' };

  return {
    context: {
      getHandler: () => handler,
      getClass: () => TestController,
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as unknown as ExecutionContext,
    setUser: (nextUser) => {
      user = nextUser;
    },
  };
}

describe('PermissionsGuard', () => {
  it('allows access when no permissions are required', async () => {
    const reflector = new Reflector();
    const guard = new PermissionsGuard(
      reflector,
      new FakeUserRepository(buildUser([])),
    );

    await expect(
      guard.canActivate(mockContext(undefined).context),
    ).resolves.toBe(true);
  });

  it('allows access when the user has all required permissions', async () => {
    const reflector = new Reflector();
    const guard = new PermissionsGuard(
      reflector,
      new FakeUserRepository(buildUser(['users.manage', 'sales.manage'])),
    );

    await expect(
      guard.canActivate(mockContext(['users.manage']).context),
    ).resolves.toBe(true);
  });

  it('throws ForbiddenException when a required permission is missing', async () => {
    const reflector = new Reflector();
    const guard = new PermissionsGuard(
      reflector,
      new FakeUserRepository(buildUser(['users.manage'])),
    );

    await expect(
      guard.canActivate(mockContext(['sales.manage']).context),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws UnauthorizedException when there is no user in the request', async () => {
    const reflector = new Reflector();
    const guard = new PermissionsGuard(
      reflector,
      new FakeUserRepository(buildUser([])),
    );

    const { context, setUser } = mockContext(['sales.manage']);
    setUser(undefined);

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
