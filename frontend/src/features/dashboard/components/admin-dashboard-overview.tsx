import type { ReactElement } from 'react';

import { CatalogCountSummary } from '@/features/dashboard/components/catalog-count-summary';
import { useAdminDashboardStatisticsQuery } from '@/features/dashboard/hooks/use-admin-dashboard-statistics-query';

type AdminDashboardOverviewProps = {
  readonly accessToken: string;
};

export function AdminDashboardOverview({ accessToken }: AdminDashboardOverviewProps): ReactElement {
  const statisticsQuery = useAdminDashboardStatisticsQuery(accessToken);
  if (statisticsQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Overview</h1>
        <p role="status">Loading dashboard statistics…</p>
      </div>
    );
  }
  if (statisticsQuery.isError || !statisticsQuery.data) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Overview</h1>
        <p className="text-destructive" role="alert">
          Unable to load dashboard statistics.
        </p>
      </div>
    );
  }
  const { statistics } = statisticsQuery.data;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Overview</h1>
        <p className="text-muted-foreground">Catalog content statistics from the API.</p>
      </div>
      <div className="flex flex-col gap-6">
        <CatalogCountSummary counts={statistics.products} label="Products" />
        <CatalogCountSummary counts={statistics.categories} label="Categories" />
        <CatalogCountSummary counts={statistics.partners} label="Partners" />
        <CatalogCountSummary counts={statistics.services} label="Services" />
      </div>
    </div>
  );
}
