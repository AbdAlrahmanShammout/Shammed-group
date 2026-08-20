import * as Joi from 'joi';

import { smtpConfigSchema } from '@/config/smtp/smtp-config.schema';

describe('smtpConfigSchema', () => {
  const schema = Joi.object(smtpConfigSchema);
  const validEnv = {
    SMTP_HOST: 'localhost',
    SMTP_PORT: '1025',
    SMTP_USER: 'test',
    SMTP_PASSWORD: 'test',
    SMTP_SECURE: 'false',
    SMTP_FROM: 'noreply@shammed-group.com',
    CONTACT_EMAIL: 'info@shammed-group.com',
  };

  it('accepts a complete SMTP configuration', () => {
    const actual = schema.validate(validEnv);
    expect(actual.error).toBeUndefined();
  });

  it('rejects a missing SMTP host', () => {
    const inputEnv = {
      SMTP_PORT: validEnv.SMTP_PORT,
      SMTP_USER: validEnv.SMTP_USER,
      SMTP_PASSWORD: validEnv.SMTP_PASSWORD,
      SMTP_SECURE: validEnv.SMTP_SECURE,
      SMTP_FROM: validEnv.SMTP_FROM,
      CONTACT_EMAIL: validEnv.CONTACT_EMAIL,
    };
    const actual = schema.validate(inputEnv);
    expect(actual.error).toBeDefined();
  });
});
