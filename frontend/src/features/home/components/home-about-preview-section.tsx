import type { ReactElement } from 'react';

import { HomeCtaLink } from '@/features/home/components/home-cta-link';
import type { HomePageResponse } from '@/generated/public-home.contract';

type HomeAboutPreviewSectionProps = {
  readonly homePage: HomePageResponse;
};

export function HomeAboutPreviewSection({ homePage }: HomeAboutPreviewSectionProps): ReactElement {
  return (
    <section aria-labelledby="home-about-title" className="border-b">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 md:px-6">
        <h2 className="text-3xl font-medium" id="home-about-title">
          {homePage.aboutPreviewTitle}
        </h2>
        <p className="max-w-3xl text-muted-foreground">{homePage.aboutPreviewDescription}</p>
        <div>
          <HomeCtaLink href={homePage.aboutPreviewCtaUrl} variant="outline">
            {homePage.aboutPreviewCtaText}
          </HomeCtaLink>
        </div>
      </div>
    </section>
  );
}
