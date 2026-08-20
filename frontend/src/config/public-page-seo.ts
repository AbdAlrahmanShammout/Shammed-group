import { appPaths } from '@/config/app-paths';

export type PublicPageSeo = {
  readonly path: string;
  readonly title: string;
  readonly description: string;
};

export const DEFAULT_SITE_NAME = 'Shammed Group';

export const publicPageSeoCatalog: readonly PublicPageSeo[] = [
  {
    path: appPaths.home,
    title: 'Medical Equipment and Pharmaceutical Services in Syria',
    description:
      'Shammed Group distributes and services medical equipment, pharmaceutical equipment, medical supplies, and specialized pharmaceutical products across Syria.',
  },
  {
    path: appPaths.about,
    title: 'About Shammed Group',
    description:
      'Learn about Shammed Group, established in Damascus in 2005 to distribute and service medical equipment and support pharmaceutical operations in Syria.',
  },
  {
    path: appPaths.partners,
    title: 'Shammed Group Partners',
    description:
      "Explore the international medical-equipment and pharmaceutical organizations named in Shammed Group's supplied company materials. Current relationships require confirmation.",
  },
  {
    path: appPaths.products,
    title: 'Medical and Pharmaceutical Solutions',
    description:
      "Discover Shammed Group's medical equipment, pharmaceutical equipment, medical supplies, consumables, and specialized pharmaceutical products for the Syrian healthcare market.",
  },
  {
    path: appPaths.services,
    title: 'Shammed Group Services',
    description:
      'From distribution and turnkey project planning to installation, maintenance, and after-sales support, Shammed Group serves healthcare organizations in Syria.',
  },
  {
    path: appPaths.contact,
    title: 'Contact Shammed Group in Syria',
    description:
      'Contact Shammed Group in Damascus about medical equipment, pharmaceutical solutions, technical service, and healthcare distribution support.',
  },
] as const;

export function findPublicPageSeo(path: string): PublicPageSeo | undefined {
  return publicPageSeoCatalog.find((entry) => entry.path === path);
}
