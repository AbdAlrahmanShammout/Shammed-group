import * as Joi from 'joi';

import { EnvironmentKind } from '@/config/environment';

export const appConfigSchema = {
  NODE_ENV: Joi.string()
    .valid(...Object.values(EnvironmentKind))
    .default(EnvironmentKind.DEVELOPMENT),
  PORT: Joi.number().port().default(3000),
  API_BASE_URL: Joi.string().uri().required(),
  ALLOWED_ORIGINS: Joi.string().required(),
} as const;
