import type { Prisma } from '@prisma/client';

import { OptionalRelations } from '@/common/base/base.entity';
import { homePageDetailsInclude } from '@/modules/home-page/types/home-page-details.include';

export type HomePageType = OptionalRelations<
  Prisma.HomePageGetPayload<{ include: typeof homePageDetailsInclude }>
>;
