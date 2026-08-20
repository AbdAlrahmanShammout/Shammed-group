import type { ReactElement } from 'react';

import type { HomePageResponse } from '@/generated/public-home.contract';

type HomeWhySectionProps = {
  readonly homePage: HomePageResponse;
};

export function HomeWhySection({ homePage }: HomeWhySectionProps): ReactElement {
  return (
    <section aria-labelledby="home-why-title" className="border-b">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 md:px-6">
        <h2 className="text-3xl font-medium" id="home-why-title">
          {homePage.whyTitle}
        </h2>
        <p className="max-w-3xl text-muted-foreground">{homePage.whyDescription}</p>
      </div>
    </section>
  );
}
