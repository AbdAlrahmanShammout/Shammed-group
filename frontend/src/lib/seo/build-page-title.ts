import { DEFAULT_SITE_NAME } from '@/config/public-page-seo';

export function buildPageTitle(pageTitle: string, siteName: string = DEFAULT_SITE_NAME): string {
  const trimmedPageTitle = pageTitle.trim();
  if (trimmedPageTitle === '' || trimmedPageTitle === siteName) {
    return siteName;
  }
  return `${trimmedPageTitle} | ${siteName}`;
}
