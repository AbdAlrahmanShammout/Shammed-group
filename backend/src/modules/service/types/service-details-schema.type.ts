import type { Prisma } from '@prisma/client';

import { OptionalRelations } from '@/common/base/base.entity';
import { serviceDetailsInclude } from '@/modules/service/types/service-details.include';

export type ServiceType = OptionalRelations<
  Prisma.ServiceGetPayload<{ include: typeof serviceDetailsInclude }>
>;
