import type { Prisma } from '@prisma/client';

export const locationDetailsInclude = {
  phones: {
    orderBy: [{ displayOrder: 'asc' as const }, { id: 'asc' as const }],
  },
} satisfies Prisma.LocationInclude;
