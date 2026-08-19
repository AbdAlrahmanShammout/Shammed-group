import { registerAs } from '@nestjs/config';

export default [
  registerAs('auth', () => ({
    adminPassword: process.env.ADMIN_PASSWORD,
  })),
];
