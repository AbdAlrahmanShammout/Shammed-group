import { z } from 'zod';

import {
  BaseZodSchema,
  ZodBoolean,
  ZodNumber,
  ZodString,
  ZodStringNullable,
} from '@/common/base/base.zod';

export const ProductCategoryZodSchema = BaseZodSchema.extend({
  name: ZodString,
  description: ZodStringNullable,
  isVisible: ZodBoolean,
  displayOrder: ZodNumber,
});

export type ProductCategoryZodType = z.infer<typeof ProductCategoryZodSchema>;
