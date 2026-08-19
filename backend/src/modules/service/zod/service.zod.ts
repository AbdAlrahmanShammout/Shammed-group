import { z } from 'zod';

import {
  BaseZodSchema,
  ZodBoolean,
  ZodNumber,
  ZodNumberNullable,
  ZodString,
} from '@/common/base/base.zod';
import { MediaEntity } from '@/modules/media/entity/media.entity';

export const ServiceZodSchema = BaseZodSchema.extend({
  title: ZodString,
  description: ZodString,
  isVisible: ZodBoolean,
  displayOrder: ZodNumber,
  imageMediaId: ZodNumberNullable,
  image: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
});

export type ServiceZodType = z.infer<typeof ServiceZodSchema>;
