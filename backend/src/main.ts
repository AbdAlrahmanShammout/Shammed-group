import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from '@/app.module';
import {
  CORS_PREFLIGHT_MAX_AGE_SECONDS,
  REQUEST_BODY_JSON_LIMIT,
} from '@/common/constants/policy.constants';
import { InputValidationPipe } from '@/common/pipes/input-validation.pipe';
import { AppConfigService } from '@/config/app/app-config.service';
import { SwaggerProvider } from '@/providers/swagger/swagger.provider';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  const appConfigService = app.get(AppConfigService);
  app.enableCors({
    origin: appConfigService.allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: CORS_PREFLIGHT_MAX_AGE_SECONDS,
  });
  app.useBodyParser('json', { limit: REQUEST_BODY_JSON_LIMIT });
  app.useBodyParser('urlencoded', { extended: true, limit: REQUEST_BODY_JSON_LIMIT });
  app.useGlobalPipes(new InputValidationPipe());
  SwaggerProvider.setupSwagger(app);
  await app.listen(appConfigService.port);
  logger.log(`Listening on ${appConfigService.port}`);
}

void bootstrap();
