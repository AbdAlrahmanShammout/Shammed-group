import type { Prisma } from '@prisma/client';

export const siteSettingsDetailsInclude = {
  logo: true,
  favicon: true,
} satisfies Prisma.SiteSettingsInclude;
