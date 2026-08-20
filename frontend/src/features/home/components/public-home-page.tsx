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

const homeSeo = findPublicPageSeo(appPaths.home);

export function PublicHomePage(): ReactElement {
  const homePageQuery = usePublicHomePageQuery();
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
  const { homePage, partners, products, services } = homePageQuery.data;
  return (
    <div>
      {homeSeo ? (
        <PageSeo description={homeSeo.description} path={homeSeo.path} title={homeSeo.title} />
      ) : null}
      <HomeHeroSection homePage={homePage} />
      <HomeAboutPreviewSection homePage={homePage} />
      <HomePartnersSection homePage={homePage} partners={partners} />
      <HomeProductsSection homePage={homePage} products={products} />
      <HomeServicesSection homePage={homePage} services={services} />
      <HomeWhySection homePage={homePage} />
      <HomeContactSection homePage={homePage} />
    </div>
  );
}
