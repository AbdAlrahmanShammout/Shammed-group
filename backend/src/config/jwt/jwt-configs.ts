import { registerAs } from '@nestjs/config';

export default [
  registerAs('token.access', () => ({
    secretKey: process.env.TOKEN_SECRET_KEY,
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  })),
];
