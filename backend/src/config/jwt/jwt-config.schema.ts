import * as Joi from 'joi';

export const jwtConfigSchema = {
  TOKEN_SECRET_KEY: Joi.string().required(),
  TOKEN_EXPIRES_IN: Joi.string().default('15m'),
} as const;
