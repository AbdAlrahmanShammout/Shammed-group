import type { Prisma } from '@prisma/client';

export const siteSettingsDetailsInclude = {
  logo: true,
  favicon: true,
  placeholder: true,
  phones: {
    orderBy: [{ displayOrder: 'asc' as const }, { id: 'asc' as const }],
  },
  emails: {
    orderBy: [{ displayOrder: 'asc' as const }, { id: 'asc' as const }],
  },
} satisfies Prisma.SiteSettingsInclude;
