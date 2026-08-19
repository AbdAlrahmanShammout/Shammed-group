import * as Joi from 'joi';

export const swaggerConfigSchema = {
  SWAGGER_PATH: Joi.string().default('docs'),
} as const;
