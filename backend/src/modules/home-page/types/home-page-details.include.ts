import type { Prisma } from '@prisma/client';

export const homePageDetailsInclude = {
  heroImage: true,
  aboutPreviewImage: true,
  whyImage: true,
} satisfies Prisma.HomePageInclude;
