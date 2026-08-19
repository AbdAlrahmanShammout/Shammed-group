import * as Joi from 'joi';

export const databaseConfigSchema = {
  DATABASE_URL: Joi.string().required(),
} as const;
