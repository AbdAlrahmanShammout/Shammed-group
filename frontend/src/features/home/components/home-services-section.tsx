import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { appPaths } from '@/config/app-paths';
import type { HomePageResponse, PublicServiceResponse } from '@/generated/public-home.contract';

type HomeServicesSectionProps = {
  readonly homePage: HomePageResponse;
  readonly services: readonly PublicServiceResponse[];
};

export function HomeServicesSection({ homePage, services }: HomeServicesSectionProps): ReactElement {
  return (
    <section aria-labelledby="home-services-title" className="border-b">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-medium" id="home-services-title">
            {homePage.servicesSectionTitle}
          </h2>
          {homePage.servicesSectionDescription ? (
            <p className="max-w-3xl text-muted-foreground">{homePage.servicesSectionDescription}</p>
          ) : null}
          <Link className="text-sm font-medium text-foreground underline-offset-4 hover:underline" to={appPaths.services}>
            View all services
          </Link>
        </div>
        {services.length === 0 ? (
          <p role="status">No services are available yet.</p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <li className="flex flex-col gap-2" key={service.id}>
                <h3 className="text-xl font-medium">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
