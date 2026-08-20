import type { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

import { PublicFooter } from '@/components/layout/public-footer';
import { PublicHeader } from '@/components/layout/public-header';
import { appPaths } from '@/config/app-paths';
import { publicNavItems } from '@/config/public-nav-items';
import { usePublicSiteSettingsQuery } from '@/features/site-chrome/hooks/use-public-site-settings-query';
import { usePublicSocialLinksQuery } from '@/features/site-chrome/hooks/use-public-social-links-query';

export function PublicSiteShell(): ReactElement {
  const siteSettingsQuery = usePublicSiteSettingsQuery();
  const socialLinksQuery = usePublicSocialLinksQuery();
  const siteSettings = siteSettingsQuery.data?.siteSettings;
  const socialLinks = socialLinksQuery.data?.socialLinks ?? [];
  return (
    <div className="flex min-h-svh flex-col">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
        href="#main-content"
      >
        Skip to content
      </a>
      <PublicHeader
        companyName={siteSettings?.companyName}
        homePath={appPaths.home}
        isSettingsPending={siteSettingsQuery.isPending}
        navItems={publicNavItems}
      />
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
      <PublicFooter
        address={siteSettings?.address}
        companyName={siteSettings?.companyName}
        copyrightYear={new Date().getFullYear()}
        email={siteSettings?.email}
        homePath={appPaths.home}
        isSettingsError={siteSettingsQuery.isError}
        isSettingsPending={siteSettingsQuery.isPending}
        navItems={publicNavItems}
        phone={siteSettings?.phone}
        socialLinks={socialLinks}
      />
    </div>
  );
}
