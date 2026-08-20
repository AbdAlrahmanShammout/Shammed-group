import type { ReactElement } from 'react';

import { PartnerListItem } from '@/features/partners/components/partner-list-item';
import { usePublicPartnersQuery } from '@/features/partners/hooks/use-public-partners-query';

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
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <h1 className="text-3xl font-medium">Partners</h1>
      {partners.length === 0 ? (
        <p className="mt-8" role="status">
          No partners are available yet.
        </p>
      ) : (
        <ul className="mt-4">
          {partners.map((partner) => (
            <PartnerListItem key={partner.id} partner={partner} />
          ))}
        </ul>
      )}
    </div>
  );
}
