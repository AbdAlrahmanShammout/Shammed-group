import type { ReactElement } from 'react';

import type { CatalogCountResponse } from '@/generated/admin-dashboard.contract';

type CatalogCountSummaryProps = {
  readonly label: string;
  readonly counts: CatalogCountResponse;
};

export function CatalogCountSummary({ label, counts }: CatalogCountSummaryProps): ReactElement {
  return (
    <section aria-labelledby={`${label}-heading`} className="flex flex-col gap-3 border-t pt-4">
      <h2 className="text-lg font-medium" id={`${label}-heading`}>
        {label}
      </h2>
      <dl className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Total</dt>
          <dd className="text-2xl font-medium">{counts.total}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Visible</dt>
          <dd className="text-2xl font-medium">{counts.visible}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Hidden</dt>
          <dd className="text-2xl font-medium">{counts.hidden}</dd>
        </div>
      </dl>
    </section>
  );
}
