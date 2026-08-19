import * as Joi from 'joi';

export const authConfigSchema = {
  ADMIN_PASSWORD: Joi.string().min(1).required(),
} as const;
