import { z } from 'zod';

import {
  BaseZodSchema,
  ZodBoolean,
  ZodNumber,
  ZodNumberNullable,
  ZodString,
  ZodStringNullable,
} from '@/common/base/base.zod';
import { MediaEntity } from '@/modules/media/entity/media.entity';
import { PartnerEntity } from '@/modules/partner/entity/partner.entity';
import { ProductCategoryEntity } from '@/modules/product-category/entity/product-category.entity';

export const ProductZodSchema = BaseZodSchema.extend({
  name: ZodString,
  shortDescription: ZodString,
  detailedDescription: ZodStringNullable,
  manufacturer: ZodStringNullable,
  isVisible: ZodBoolean,
  displayOrder: ZodNumber,
  categoryId: ZodNumber,
  partnerId: ZodNumberNullable,
  imageMediaId: ZodNumberNullable,
  category: (z.any() as z.ZodType<ProductCategoryEntity | undefined>).optional(),
  partner: (z.any() as z.ZodType<PartnerEntity | undefined>).optional(),
  image: (z.any() as z.ZodType<MediaEntity | undefined>).optional(),
});

export type ProductZodType = z.infer<typeof ProductZodSchema>;
