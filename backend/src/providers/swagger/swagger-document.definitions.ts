import { Type } from '@nestjs/common';

import { AdminApiModule } from '@/modules/admin-api.module';
import { PublicApiModule } from '@/modules/public-api.module';
import {
  SWAGGER_ADMIN_DESCRIPTION,
  SWAGGER_ADMIN_JSON_PATH,
  SWAGGER_ADMIN_NAME,
  SWAGGER_ADMIN_TITLE_SUFFIX,
  SWAGGER_PUBLIC_DESCRIPTION,
  SWAGGER_PUBLIC_JSON_PATH,
  SWAGGER_PUBLIC_NAME,
  SWAGGER_PUBLIC_TITLE_SUFFIX,
} from '@/providers/swagger/consts';

export type SwaggerDocumentDefinition = {
  readonly name: string;
  readonly titleSuffix: string;
  readonly description: string;
  readonly jsonPath: string;
  readonly include: readonly Type<unknown>[];
  readonly hasBearerAuth: boolean;
};

export const SWAGGER_DOCUMENT_DEFINITIONS: readonly SwaggerDocumentDefinition[] = [
  {
    name: SWAGGER_PUBLIC_NAME,
    titleSuffix: SWAGGER_PUBLIC_TITLE_SUFFIX,
    description: SWAGGER_PUBLIC_DESCRIPTION,
    jsonPath: SWAGGER_PUBLIC_JSON_PATH,
    include: [PublicApiModule],
    hasBearerAuth: false,
  },
  {
    name: SWAGGER_ADMIN_NAME,
    titleSuffix: SWAGGER_ADMIN_TITLE_SUFFIX,
    description: SWAGGER_ADMIN_DESCRIPTION,
    jsonPath: SWAGGER_ADMIN_JSON_PATH,
    include: [AdminApiModule],
    hasBearerAuth: true,
  },
] as const;
