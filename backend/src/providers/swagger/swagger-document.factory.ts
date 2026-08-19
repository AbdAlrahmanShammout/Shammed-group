import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { SwaggerConfigService } from '@/config/swagger/swagger-config.service';
import { SwaggerDocumentDefinition } from '@/providers/swagger/swagger-document.definitions';

export function createSwaggerDocument(
  app: INestApplication,
  _swaggerConfigService: SwaggerConfigService,
  definition: SwaggerDocumentDefinition,
): OpenAPIObject {
  const documentBuilder = new DocumentBuilder()
    .setTitle(`API ${definition.titleSuffix}`)
    .setDescription(definition.description)
    .setVersion('1.0');
  if (definition.hasBearerAuth) {
    documentBuilder.addBearerAuth();
  }
  return SwaggerModule.createDocument(app, documentBuilder.build(), {
    include: [...definition.include],
  });
}
