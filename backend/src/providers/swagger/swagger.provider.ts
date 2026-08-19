import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { AppConfigService } from '@/config/app/app-config.service';
import { SwaggerConfigService } from '@/config/swagger/swagger-config.service';
import { SWAGGER_DOCUMENT_DEFINITIONS } from '@/providers/swagger/swagger-document.definitions';
import { createSwaggerDocument } from '@/providers/swagger/swagger-document.factory';

export class SwaggerProvider {
  static setupSwagger(app: INestApplication): void {
    const appConfigService = app.get(AppConfigService);
    if (!appConfigService.isDocumentationEnabled) {
      return;
    }
    const swaggerConfigService = app.get(SwaggerConfigService);
    for (const definition of SWAGGER_DOCUMENT_DEFINITIONS) {
      const document = createSwaggerDocument(app, swaggerConfigService, definition);
      SwaggerModule.setup(`${swaggerConfigService.path}/${definition.name}`, app, document, {
        jsonDocumentUrl: definition.jsonPath,
      });
    }
  }
}
