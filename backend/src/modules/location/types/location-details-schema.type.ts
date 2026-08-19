import type { Prisma } from '@prisma/client';

import { OptionalRelations } from '@/common/base/base.entity';
import { locationDetailsInclude } from '@/modules/location/types/location-details.include';

export type LocationType = OptionalRelations<
  Prisma.LocationGetPayload<{ include: typeof locationDetailsInclude }>
>;
