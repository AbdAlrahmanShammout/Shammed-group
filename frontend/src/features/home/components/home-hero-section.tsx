import type { ReactElement } from 'react';

import { PublicMediaImage } from '@/components/media/public-media-image';
import { HomeCtaLink } from '@/features/home/components/home-cta-link';
import type { HomePageResponse } from '@/generated/public-home.contract';

type HomeHeroSectionProps = {
  readonly homePage: HomePageResponse;
};

export function HomeHeroSection({ homePage }: HomeHeroSectionProps): ReactElement {
  const heroImageMediaId = homePage.heroImageMediaId;
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden border-b bg-[radial-gradient(circle_at_top_left,#E8ECF7_0%,#FFFFFF_45%,#F5F7FA_100%)]"
    >
      {heroImageMediaId ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <PublicMediaImage
            alt=""
            className="h-full w-full object-cover opacity-35"
            loading="eager"
            mediaId={heroImageMediaId}
          />
          <div className="absolute inset-0 bg-background/55" />
        </div>
      ) : null}
      <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center gap-6 px-4 py-20 md:px-6">
        <h1
          className="max-w-3xl text-4xl font-medium tracking-tight text-foreground md:text-6xl"
          id="home-hero-title"
        >
          {homePage.heroTitle}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">{homePage.heroDescription}</p>
        <div className="flex flex-wrap gap-4">
          <HomeCtaLink href={homePage.primaryCtaUrl}>{homePage.primaryCtaText}</HomeCtaLink>
          <HomeCtaLink href={homePage.secondaryCtaUrl} variant="outline">
            {homePage.secondaryCtaText}
          </HomeCtaLink>
        </div>
      </div>
    </section>
  );
}
