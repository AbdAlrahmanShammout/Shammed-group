import type { Prisma } from '@prisma/client';

export const serviceDetailsInclude = {
  image: true,
} satisfies Prisma.ServiceInclude;
