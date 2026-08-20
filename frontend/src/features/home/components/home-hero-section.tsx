import type { ReactElement } from 'react';

import { HomeCtaLink } from '@/features/home/components/home-cta-link';
import type { HomePageResponse } from '@/generated/public-home.contract';

type HomeHeroSectionProps = {
  readonly homePage: HomePageResponse;
};

export function HomeHeroSection({ homePage }: HomeHeroSectionProps): ReactElement {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden border-b bg-[radial-gradient(circle_at_top_left,_oklch(0.97_0.01_240)_0%,_oklch(0.99_0_0)_45%,_oklch(0.96_0.02_200)_100%)]"
    >
      <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center gap-6 px-4 py-20 md:px-6">
        <h1 className="max-w-3xl text-4xl font-medium tracking-tight text-foreground md:text-6xl" id="home-hero-title">
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
