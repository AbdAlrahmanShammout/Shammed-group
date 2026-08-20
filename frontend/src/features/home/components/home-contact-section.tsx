import type { ReactElement } from 'react';

import { appPaths } from '@/config/app-paths';
import { HomeCtaLink } from '@/features/home/components/home-cta-link';
import type { HomePageResponse } from '@/generated/public-home.contract';

type HomeContactSectionProps = {
  readonly homePage: HomePageResponse;
};

export function HomeContactSection({ homePage }: HomeContactSectionProps): ReactElement {
  return (
    <section aria-labelledby="home-contact-title">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 md:px-6">
        <h2 className="text-3xl font-medium" id="home-contact-title">
          {homePage.contactSectionTitle}
        </h2>
        {homePage.contactSectionDescription ? (
          <p className="max-w-3xl text-muted-foreground">{homePage.contactSectionDescription}</p>
        ) : null}
        <div>
          <HomeCtaLink href={appPaths.contact}>{homePage.contactSectionTitle}</HomeCtaLink>
        </div>
      </div>
    </section>
  );
}
