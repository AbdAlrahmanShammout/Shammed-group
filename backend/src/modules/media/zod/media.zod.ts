import { z } from 'zod';

import { BaseZodSchema, ZodNumber, ZodString } from '@/common/base/base.zod';

export const MediaZodSchema = BaseZodSchema.extend({
  originalFileName: ZodString,
  storedFileName: ZodString,
  mimeType: ZodString,
  byteSize: ZodNumber,
  storageKey: ZodString,
});

export type MediaZodType = z.infer<typeof MediaZodSchema>;
