import type { Prisma } from '@prisma/client';

import { OptionalRelations } from '@/common/base/base.entity';
import { aboutPageDetailsInclude } from '@/modules/about-page/types/about-page-details.include';

export type AboutPageType = OptionalRelations<
  Prisma.AboutPageGetPayload<{ include: typeof aboutPageDetailsInclude }>
>;
