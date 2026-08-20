import type { Prisma } from '@prisma/client';

export const aboutPageDetailsInclude = {
  overviewImage: true,
} satisfies Prisma.AboutPageInclude;
