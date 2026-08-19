import * as Joi from 'joi';

const DEFAULT_STORAGE_ROOT_PATH = 'storage';
const DEFAULT_STORAGE_MAX_FILE_BYTES = 5 * 1024 * 1024;

export const storageConfigSchema = {
  STORAGE_ROOT_PATH: Joi.string().default(DEFAULT_STORAGE_ROOT_PATH),
  STORAGE_MAX_FILE_BYTES: Joi.number().integer().positive().default(DEFAULT_STORAGE_MAX_FILE_BYTES),
} as const;
