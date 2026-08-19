import type { Prisma } from '@prisma/client';

import { partnerDetailsInclude } from '@/modules/partner/types/partner-details.include';

export const productDetailsInclude = {
  category: true,
  partner: {
    include: partnerDetailsInclude,
  },
  image: true,
} satisfies Prisma.ProductInclude;
