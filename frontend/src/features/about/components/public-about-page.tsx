import type { ReactElement } from 'react';

import { AboutContentSection } from '@/features/about/components/about-content-section';
import { usePublicAboutPageQuery } from '@/features/about/hooks/use-public-about-page-query';

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
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h1 className="text-3xl font-medium">About Us</h1>
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
