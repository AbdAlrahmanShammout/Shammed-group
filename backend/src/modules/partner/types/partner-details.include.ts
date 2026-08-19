import type { Prisma } from '@prisma/client';

export const partnerDetailsInclude = {
  logo: true,
} satisfies Prisma.PartnerInclude;
