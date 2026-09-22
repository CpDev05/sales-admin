import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TokenPayload } from '../../application/ports/token.port';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { REQUIRED_PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tokenUser = request.user as TokenPayload | undefined;

    if (!tokenUser) {
      throw new UnauthorizedException();
    }

    const user = await this.users.findById(tokenUser.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    const grantedPermissions = new Set<string>();

    for (const role of user.roles) {
      for (const permission of role.permissions) {
        grantedPermissions.add(permission.code);
      }
    }

    const hasAll = requiredPermissions.every((code) =>
      grantedPermissions.has(code),
    );

    if (!hasAll) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
