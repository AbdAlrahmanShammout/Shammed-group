import type { ReactElement } from 'react';

import { PageSeo } from '@/components/seo/page-seo';
import { appPaths } from '@/config/app-paths';
import { findPublicPageSeo } from '@/config/public-page-seo';
import { ServiceListItem } from '@/features/services/components/service-list-item';
import { usePublicServicesQuery } from '@/features/services/hooks/use-public-services-query';

const servicesSeo = findPublicPageSeo(appPaths.services);

export function PublicServicesPage(): ReactElement {
  const servicesQuery = usePublicServicesQuery();
  if (servicesQuery.isPending) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="status">
        Loading services…
      </div>
    );
  }
  if (servicesQuery.isError || !servicesQuery.data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="alert">
        Unable to load services.
      </div>
    );
  }
  const { services } = servicesQuery.data;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      {servicesSeo ? (
        <PageSeo
          description={servicesSeo.description}
          path={servicesSeo.path}
          title={servicesSeo.title}
        />
      ) : null}
      <h1 className="text-3xl font-medium">Services</h1>
      {services.length === 0 ? (
        <p className="mt-8" role="status">
          No services are available yet.
        </p>
      ) : (
        <ul className="mt-4">
          {services.map((service) => (
            <ServiceListItem key={service.id} service={service} />
          ))}
        </ul>
      )}
    </div>
  );
}
