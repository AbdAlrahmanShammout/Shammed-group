import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import appConfigs from '@/config/app/app-configs';
import { appConfigSchema } from '@/config/app/app-config.schema';
import { AppConfigService } from '@/config/app/app-config.service';
import authConfigs from '@/config/auth/auth-configs';
import { authConfigSchema } from '@/config/auth/auth-config.schema';
import { AuthConfigService } from '@/config/auth/auth-config.service';
import databaseConfigs from '@/config/database/database-configs';
import { databaseConfigSchema } from '@/config/database/database-config.schema';
import { DatabaseConfigService } from '@/config/database/database-config.service';
import jwtConfigs from '@/config/jwt/jwt-configs';
import { jwtConfigSchema } from '@/config/jwt/jwt-config.schema';
import { JwtConfigService } from '@/config/jwt/jwt-config.service';
import smtpConfigs from '@/config/smtp/smtp-configs';
import { smtpConfigSchema } from '@/config/smtp/smtp-config.schema';
import { SmtpConfigService } from '@/config/smtp/smtp-config.service';
import storageConfigs from '@/config/storage/storage-configs';
import { storageConfigSchema } from '@/config/storage/storage-config.schema';
import { StorageConfigService } from '@/config/storage/storage-config.service';
import swaggerConfigs from '@/config/swagger/swagger-configs';
import { swaggerConfigSchema } from '@/config/swagger/swagger-config.schema';
import { SwaggerConfigService } from '@/config/swagger/swagger-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [
        ...appConfigs,
        ...authConfigs,
        ...databaseConfigs,
        ...jwtConfigs,
        ...smtpConfigs,
        ...storageConfigs,
        ...swaggerConfigs,
      ],
      validationSchema: Joi.object({
        ...appConfigSchema,
        ...authConfigSchema,
        ...databaseConfigSchema,
        ...jwtConfigSchema,
        ...smtpConfigSchema,
        ...storageConfigSchema,
        ...swaggerConfigSchema,
      }),
      validationOptions: { abortEarly: false, allowUnknown: true },
    }),
  ],
  providers: [
    AppConfigService,
    AuthConfigService,
    DatabaseConfigService,
    JwtConfigService,
    SmtpConfigService,
    StorageConfigService,
    SwaggerConfigService,
  ],
  exports: [
    AppConfigService,
    AuthConfigService,
    DatabaseConfigService,
    JwtConfigService,
    SmtpConfigService,
    StorageConfigService,
    SwaggerConfigService,
  ],
})
export class ConfigsModule {}
