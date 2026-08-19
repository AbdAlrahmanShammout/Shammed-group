import type { Prisma } from '@prisma/client';

import { OptionalRelations } from '@/common/base/base.entity';
import { siteSettingsDetailsInclude } from '@/modules/site-settings/types/site-settings-details.include';

export type SiteSettingsType = OptionalRelations<
  Prisma.SiteSettingsGetPayload<{ include: typeof siteSettingsDetailsInclude }>
>;
