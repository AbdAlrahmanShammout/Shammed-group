import type { Prisma } from '@prisma/client';

import { OptionalRelations } from '@/common/base/base.entity';
import { productDetailsInclude } from '@/modules/product/types/product-details.include';

export type ProductType = OptionalRelations<
  Prisma.ProductGetPayload<{ include: typeof productDetailsInclude }>
>;
