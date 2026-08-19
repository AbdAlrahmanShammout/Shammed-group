import type { Prisma } from '@prisma/client';

import { OptionalRelations } from '@/common/base/base.entity';
import { mediaDetailsInclude } from '@/modules/media/types/media-details.include';

export type MediaType = OptionalRelations<
  Prisma.MediaGetPayload<{ include: typeof mediaDetailsInclude }>
>;
