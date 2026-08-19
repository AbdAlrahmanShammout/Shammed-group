import { registerAs } from '@nestjs/config';

const DEFAULT_STORAGE_ROOT_PATH = 'storage';
const DEFAULT_STORAGE_MAX_FILE_BYTES = 5 * 1024 * 1024;

export default [
  registerAs('storage', () => ({
    rootPath: process.env.STORAGE_ROOT_PATH ?? DEFAULT_STORAGE_ROOT_PATH,
    maxFileBytes: Number(process.env.STORAGE_MAX_FILE_BYTES ?? DEFAULT_STORAGE_MAX_FILE_BYTES),
  })),
];
