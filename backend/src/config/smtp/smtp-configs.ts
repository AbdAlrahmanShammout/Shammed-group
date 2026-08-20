import { registerAs } from '@nestjs/config';

export default [
  registerAs('smtp', () => ({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    secure: process.env.SMTP_SECURE === 'true',
    from: process.env.SMTP_FROM,
    contactEmail: process.env.CONTACT_EMAIL,
  })),
];
