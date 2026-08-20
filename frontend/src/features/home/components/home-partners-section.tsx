import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { appPaths } from '@/config/app-paths';
import type { HomePageResponse, PublicPartnerResponse } from '@/generated/public-home.contract';

type HomePartnersSectionProps = {
  readonly homePage: HomePageResponse;
  readonly partners: readonly PublicPartnerResponse[];
};

export function HomePartnersSection({ homePage, partners }: HomePartnersSectionProps): ReactElement {
  return (
    <section aria-labelledby="home-partners-title" className="border-b">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-medium" id="home-partners-title">
            {homePage.partnersSectionTitle}
          </h2>
          {homePage.partnersSectionDescription ? (
            <p className="max-w-3xl text-muted-foreground">{homePage.partnersSectionDescription}</p>
          ) : null}
          <Link className="text-sm font-medium text-foreground underline-offset-4 hover:underline" to={appPaths.partners}>
            View all partners
          </Link>
        </div>
        {partners.length === 0 ? (
          <p role="status">No partners are available yet.</p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2">
            {partners.map((partner) => (
              <li className="flex flex-col gap-2" key={partner.id}>
                <h3 className="text-xl font-medium">{partner.name}</h3>
                <p className="text-muted-foreground">{partner.shortDescription}</p>
                {partner.specialization ? (
                  <p className="text-sm text-muted-foreground">{partner.specialization}</p>
                ) : null}
                {partner.websiteUrl ? (
                  <a
                    className="text-sm font-medium underline-offset-4 hover:underline"
                    href={partner.websiteUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Visit website
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
