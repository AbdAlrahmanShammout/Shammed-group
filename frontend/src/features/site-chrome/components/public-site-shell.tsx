import { useEffect, type ReactElement } from 'react';
import { Outlet } from 'react-router-dom';

import { PublicFooter } from '@/components/layout/public-footer';
import { PublicHeader } from '@/components/layout/public-header';
import { ImagePlaceholderContext } from '@/components/media/image-placeholder-context';
import { appPaths } from '@/config/app-paths';
import { publicNavItems } from '@/config/public-nav-items';
import { usePublicLocationsQuery } from '@/features/site-chrome/hooks/use-public-locations-query';
import { usePublicSiteSettingsQuery } from '@/features/site-chrome/hooks/use-public-site-settings-query';
import { usePublicSocialLinksQuery } from '@/features/site-chrome/hooks/use-public-social-links-query';
import { applyDocumentColors } from '@/lib/apply-document-colors';
import { createLocationMapsEmbedUrl } from '@/lib/create-location-maps-embed-url';
import { createPublicMediaUrl } from '@/lib/create-public-media-url';
import { toSiteContactEmails } from '@/lib/to-site-contact-emails';
import { toSiteContactPhones } from '@/lib/to-site-contact-phones';

function applyDocumentFavicon(faviconMediaId: number | undefined): void {
  const existing = document.head.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
  existing.forEach((element) => {
    element.remove();
  });
  if (faviconMediaId === undefined) {
    return;
  }
  const iconLink = document.createElement('link');
  iconLink.rel = 'icon';
  iconLink.type = 'image/png';
  iconLink.href = createPublicMediaUrl(faviconMediaId);
  document.head.appendChild(iconLink);
}

export function PublicSiteShell(): ReactElement {
  const siteSettingsQuery = usePublicSiteSettingsQuery();
  const socialLinksQuery = usePublicSocialLinksQuery();
  const locationsQuery = usePublicLocationsQuery();
  const siteSettings = siteSettingsQuery.data?.siteSettings;
  const socialLinks = socialLinksQuery.data?.socialLinks ?? [];
  const mapLocations = (locationsQuery.data?.locations ?? []).flatMap((location) => {
    if (!location.isMapVisible) {
      return [];
    }
    const embedUrl = createLocationMapsEmbedUrl(location);
    if (!embedUrl) {
      return [];
    }
    return [{ id: location.id, name: location.name, embedUrl }];
  });
  useEffect(() => {
    applyDocumentFavicon(siteSettings?.faviconMediaId);
  }, [siteSettings?.faviconMediaId]);

  useEffect(() => {
    if (!siteSettings) return;
    applyDocumentColors(siteSettings);
  }, [
    siteSettings,
    siteSettings?.primaryColor,
    siteSettings?.accentColor,
    siteSettings?.backgroundColor,
    siteSettings?.textColor,
    siteSettings?.secondaryColor,
    siteSettings?.borderColor,
  ]);

  const placeholderSrc = siteSettings?.placeholderMediaId
    ? createPublicMediaUrl(siteSettings.placeholderMediaId, 300)
    : undefined;

  return (
    <ImagePlaceholderContext.Provider value={placeholderSrc}>
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
        logoMediaId={siteSettings?.logoMediaId}
        navItems={publicNavItems}
      />
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
      <PublicFooter
        address={siteSettings?.address}
        companyName={siteSettings?.companyName}
        copyrightYear={new Date().getFullYear()}
        emails={siteSettings ? toSiteContactEmails(siteSettings) : []}
        homePath={appPaths.home}
        isSettingsError={siteSettingsQuery.isError}
        isSettingsPending={siteSettingsQuery.isPending}
        logoMediaId={siteSettings?.logoMediaId}
        mapLocations={mapLocations}
        navItems={publicNavItems}
        phones={siteSettings ? toSiteContactPhones(siteSettings) : []}
        socialLinks={socialLinks}
      />
    </div>
    </ImagePlaceholderContext.Provider>
  );
}
