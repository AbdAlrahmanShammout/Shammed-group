import * as Joi from 'joi';

export const smtpConfigSchema = {
  SMTP_HOST: Joi.string().min(1).required(),
  SMTP_PORT: Joi.number().port().required(),
  SMTP_USER: Joi.string().min(1).required(),
  SMTP_PASSWORD: Joi.string().min(1).required(),
  SMTP_SECURE: Joi.boolean().truthy('true').falsy('false').required(),
  SMTP_FROM: Joi.string().email().required(),
  CONTACT_EMAIL: Joi.string().email().required(),
} as const;
