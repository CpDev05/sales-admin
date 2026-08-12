import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DATE_PORT } from '../../application/ports/date.port';
import { HASH_PORT } from '../../application/ports/hash.port';
import { TOKEN_PORT } from '../../application/ports/token.port';
import { UUID_PORT } from '../../application/ports/uuid.port';
import { CreatePermissionUseCase } from '../../application/use-cases/admin/create-permission.use-case';
import { CreateRoleUseCase } from '../../application/use-cases/admin/create-role.use-case';
import { CreateUserUseCase } from '../../application/use-cases/admin/create-user.use-case';
import { ListPermissionsUseCase } from '../../application/use-cases/admin/list-permissions.use-case';
import { ListRolesUseCase } from '../../application/use-cases/admin/list-roles.use-case';
import { ListUsersUseCase } from '../../application/use-cases/admin/list-users.use-case';
import { GetAuthUserUseCase } from '../../application/use-cases/identity/get-auth-user.use-case';
import { LoginUseCase } from '../../application/use-cases/identity/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/identity/logout.use-case';
import { RefreshSessionUseCase } from '../../application/use-cases/identity/refresh-session.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/identity/register-user.use-case';
import { PERMISSION_REPOSITORY } from '../../domain/repositories/permission.repository';
import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/refresh-token.repository';
import { ROLE_REPOSITORY } from '../../domain/repositories/role.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { AdminController } from '../../presentation/controllers/admin.controller';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { PrismaModule } from '../database/prisma/prisma.module';
import { PrismaPermissionRepository } from '../repositories/prisma-permission.repository';
import { PrismaRefreshTokenRepository } from '../repositories/prisma-refresh-token.repository';
import { PrismaRoleRepository } from '../repositories/prisma-role.repository';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { BcryptHashService } from './bcrypt-hash.service';
import { CryptoUuidService } from './crypto-uuid.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtTokenService } from './jwt-token.service';
import { SystemDateService } from './system-date.service';

@Module({
  imports: [PassportModule, JwtModule.register({}), PrismaModule],
  controllers: [AuthController, AdminController],
  providers: [
    RegisterUserUseCase,
    LoginUseCase,
    RefreshSessionUseCase,
    LogoutUseCase,
    GetAuthUserUseCase,
    ListPermissionsUseCase,
    CreatePermissionUseCase,
    ListRolesUseCase,
    CreateRoleUseCase,
    ListUsersUseCase,
    CreateUserUseCase,
    JwtStrategy,
    {
      provide: PERMISSION_REPOSITORY,
      useClass: PrismaPermissionRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: ROLE_REPOSITORY,
      useClass: PrismaRoleRepository,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: PrismaRefreshTokenRepository,
    },
    {
      provide: HASH_PORT,
      useClass: BcryptHashService,
    },
    {
      provide: TOKEN_PORT,
      useClass: JwtTokenService,
    },
    {
      provide: UUID_PORT,
      useClass: CryptoUuidService,
    },
    {
      provide: DATE_PORT,
      useClass: SystemDateService,
    },
  ],
})
export class AuthModule {}
