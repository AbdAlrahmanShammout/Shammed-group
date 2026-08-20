import type { ReactElement } from 'react';

import { PageSeo } from '@/components/seo/page-seo';
import { appPaths } from '@/config/app-paths';
import { findPublicPageSeo } from '@/config/public-page-seo';
import { PartnerListItem } from '@/features/partners/components/partner-list-item';
import { usePublicPartnersQuery } from '@/features/partners/hooks/use-public-partners-query';

const partnersSeo = findPublicPageSeo(appPaths.partners);

export function PublicPartnersPage(): ReactElement {
  const partnersQuery = usePublicPartnersQuery();
  if (partnersQuery.isPending) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="status">
        Loading partners…
      </div>
    );
  }
  if (partnersQuery.isError || !partnersQuery.data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="alert">
        Unable to load partners.
      </div>
    );
  }
  const { partners } = partnersQuery.data;
  return (
    <div className="bg-[linear-gradient(180deg,oklch(0.985_0.004_240)_0%,oklch(0.99_0_0)_18rem,oklch(0.99_0_0)_100%)]">
      {partnersSeo ? (
        <PageSeo
          description={partnersSeo.description}
          path={partnersSeo.path}
          title={partnersSeo.title}
        />
      ) : null}
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 md:px-6 md:py-20">
        <header className="flex max-w-3xl flex-col gap-3">
          <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            International network
          </p>
          <h1 className="text-3xl font-medium tracking-tight md:text-5xl">Partners</h1>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Medical-technology and pharmaceutical organizations Shammed Group works with across
            distribution, representation, and healthcare projects.
          </p>
        </header>
        {partners.length === 0 ? (
          <p role="status">No partners are available yet.</p>
        ) : (
          <ul className="flex flex-col gap-5">
            {partners.map((partner) => (
              <PartnerListItem key={partner.id} partner={partner} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
