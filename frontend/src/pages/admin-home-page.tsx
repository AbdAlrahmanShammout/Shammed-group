import type { ReactElement } from 'react';

import { AdminDashboardOverview } from '@/features/dashboard/components/admin-dashboard-overview';

type AdminHomePageProps = {
  readonly accessToken: string;
};

export function AdminHomePage({ accessToken }: AdminHomePageProps): ReactElement {
  return <AdminDashboardOverview accessToken={accessToken} />;
}
