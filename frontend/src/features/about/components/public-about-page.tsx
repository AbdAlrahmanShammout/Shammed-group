import type { ReactElement } from 'react';

import { PublicMediaImage } from '@/components/media/public-media-image';
import { PageSeo } from '@/components/seo/page-seo';
import { appPaths } from '@/config/app-paths';
import { findPublicPageSeo } from '@/config/public-page-seo';
import { AboutContentSection } from '@/features/about/components/about-content-section';
import { usePublicAboutPageQuery } from '@/features/about/hooks/use-public-about-page-query';

const aboutSeo = findPublicPageSeo(appPaths.about);

export function PublicAboutPage(): ReactElement {
  const aboutPageQuery = usePublicAboutPageQuery();
  if (aboutPageQuery.isPending) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="status">
        Loading about page…
      </div>
    );
  }
  if (aboutPageQuery.isError || !aboutPageQuery.data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="alert">
        Unable to load the about page.
      </div>
    );
  }
  const { aboutPage } = aboutPageQuery.data;
  return (
    <div>
      {aboutSeo ? (
        <PageSeo description={aboutSeo.description} path={aboutSeo.path} title={aboutSeo.title} />
      ) : null}
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:px-6">
        <h1 className="text-3xl font-medium tracking-tight md:text-5xl">About Us</h1>
        {aboutPage.overviewImageMediaId !== undefined ? (
          <PublicMediaImage
            alt="Shammed Group team"
            className="max-h-[32rem] w-full rounded-2xl object-cover"
            loading="eager"
            mediaId={aboutPage.overviewImageMediaId}
          />
        ) : null}
      </div>
      <AboutContentSection body={aboutPage.overview} title="Company Overview" titleId="about-overview" />
      <AboutContentSection body={aboutPage.vision} title="Vision" titleId="about-vision" />
      <AboutContentSection body={aboutPage.mission} title="Mission" titleId="about-mission" />
      <AboutContentSection body={aboutPage.values} title="Values" titleId="about-values" />
      <AboutContentSection
        body={aboutPage.capabilities}
        title="Capabilities"
        titleId="about-capabilities"
      />
    </div>
  );
}
