import { registerAs } from '@nestjs/config';

export default [
  registerAs('app', () => ({
    env: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    url: process.env.API_BASE_URL,
    allowedOrigins: (process.env.ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter((origin) => origin.length > 0),
  })),
];
