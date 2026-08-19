import type { Prisma } from '@prisma/client';

import { OptionalRelations } from '@/common/base/base.entity';
import { partnerDetailsInclude } from '@/modules/partner/types/partner-details.include';

export type PartnerType = OptionalRelations<
  Prisma.PartnerGetPayload<{ include: typeof partnerDetailsInclude }>
>;
