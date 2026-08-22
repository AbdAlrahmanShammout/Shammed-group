import type { ReactElement } from 'react';

import { PageSeo } from '@/components/seo/page-seo';
import { appPaths } from '@/config/app-paths';
import { findPublicPageSeo } from '@/config/public-page-seo';
import { HomeAboutPreviewSection } from '@/features/home/components/home-about-preview-section';
import { HomeContactSection } from '@/features/home/components/home-contact-section';
import { HomeHeroSection } from '@/features/home/components/home-hero-section';
import { HomePartnersSection } from '@/features/home/components/home-partners-section';
import { HomeProductsSection } from '@/features/home/components/home-products-section';
import { HomeServicesSection } from '@/features/home/components/home-services-section';
import { HomeWhySection } from '@/features/home/components/home-why-section';
import { usePublicHomePageQuery } from '@/features/home/hooks/use-public-home-page-query';
import { usePublicSiteSettingsQuery } from '@/features/site-chrome/hooks/use-public-site-settings-query';

const homeSeo = findPublicPageSeo(appPaths.home);

export function PublicHomePage(): ReactElement {
  const homePageQuery = usePublicHomePageQuery();
  const siteSettingsQuery = usePublicSiteSettingsQuery();
  const siteSettings = siteSettingsQuery.data?.siteSettings;
  if (homePageQuery.isPending) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="status">
        Loading home page…
      </div>
    );
  }
  if (homePageQuery.isError || !homePageQuery.data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="alert">
        Unable to load the home page.
      </div>
    );
  }
  const { homePage, partners, services } = homePageQuery.data;
  return (
    <div>
      {homeSeo ? (
        <PageSeo description={homeSeo.description} path={homeSeo.path} title={homeSeo.title} />
      ) : null}
      <HomeHeroSection homePage={homePage} />
      <HomeAboutPreviewSection homePage={homePage} />
      <HomePartnersSection homePage={homePage} partners={partners} />
      <HomeProductsSection homePage={homePage} partners={partners} />
      <HomeServicesSection homePage={homePage} services={services} />
      <HomeWhySection
        companyName={siteSettings?.companyName}
        homePage={homePage}
        logoMediaId={siteSettings?.logoMediaId}
      />
      <HomeContactSection homePage={homePage} />
    </div>
  );
}
