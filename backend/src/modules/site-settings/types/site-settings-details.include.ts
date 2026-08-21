import type { Prisma } from '@prisma/client';

export const siteSettingsDetailsInclude = {
  logo: true,
  favicon: true,
  placeholder: true,
} satisfies Prisma.SiteSettingsInclude;
