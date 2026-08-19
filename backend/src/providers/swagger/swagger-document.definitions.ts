import { Type } from '@nestjs/common';

export type SwaggerDocumentDefinition = {
  readonly name: string;
  readonly titleSuffix: string;
  readonly description: string;
  readonly jsonPath: string;
  readonly include: readonly Type<unknown>[];
  readonly hasBearerAuth: boolean;
};

export const SWAGGER_DOCUMENT_DEFINITIONS: readonly SwaggerDocumentDefinition[] = [] as const;
