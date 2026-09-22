import { Module } from '@nestjs/common';

import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { PermissionsGuard } from '../../presentation/guards/permissions.guard';
import { PrismaModule } from '../database/prisma/prisma.module';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    PermissionsGuard,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [PermissionsGuard, USER_REPOSITORY],
})
export class PermissionsModule {}
