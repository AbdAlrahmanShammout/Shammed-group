import type { Prisma } from '@prisma/client';

import { OptionalRelations } from '@/common/base/base.entity';

export type ProductCategoryType = OptionalRelations<Prisma.ProductCategoryGetPayload<object>>;
