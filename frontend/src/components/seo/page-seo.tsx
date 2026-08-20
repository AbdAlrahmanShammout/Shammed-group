import { useEffect, type ReactElement } from 'react';

import { appEnv } from '@/config/env';
import { applyDocumentSeo } from '@/lib/seo/apply-document-seo';
import { buildPageTitle } from '@/lib/seo/build-page-title';

type PageSeoProps = {
  readonly description: string;
  readonly path: string;
  readonly title: string;
};

function createCanonicalUrl(path: string): string {
  if (path === '/') {
    return `${appEnv.publicSiteUrl}/`;
  }
  return `${appEnv.publicSiteUrl}${path}`;
}

/**
 * Sets public page title, meta description, and Open Graph tags for the current route.
 */
export function PageSeo({ description, path, title }: PageSeoProps): ReactElement | null {
  useEffect(() => {
    applyDocumentSeo({
      title: buildPageTitle(title),
      description,
      canonicalUrl: createCanonicalUrl(path),
    });
  }, [description, path, title]);
  return null;
}
