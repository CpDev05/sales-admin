import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration, envValidationSchema } from './infrastructure/config';
import { AuthModule } from './infrastructure/security/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [configuration],
      validationSchema: envValidationSchema,
    }),
    AuthModule,
  ],
})
export class AppModule {}
