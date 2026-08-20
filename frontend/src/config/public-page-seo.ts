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
    title: 'Home',
    description:
      'Shammed Group supplies pharmaceutical and healthcare products through trusted regional partners.',
  },
  {
    path: appPaths.about,
    title: 'About',
    description:
      'Learn about Shammed Group’s vision, mission, values, and capabilities in healthcare distribution.',
  },
  {
    path: appPaths.partners,
    title: 'Partners',
    description:
      'Explore Shammed Group’s partner network across pharmaceutical and healthcare markets.',
  },
  {
    path: appPaths.products,
    title: 'Products',
    description:
      'Browse Shammed Group’s product catalog by category, including manufacturer and partner details.',
  },
  {
    path: appPaths.services,
    title: 'Services',
    description:
      'Review Shammed Group services spanning distribution, logistics, and healthcare support.',
  },
  {
    path: appPaths.contact,
    title: 'Contact',
    description:
      'Contact Shammed Group by email, phone, location, or the online inquiry form.',
  },
] as const;

export function findPublicPageSeo(path: string): PublicPageSeo | undefined {
  return publicPageSeoCatalog.find((entry) => entry.path === path);
}
