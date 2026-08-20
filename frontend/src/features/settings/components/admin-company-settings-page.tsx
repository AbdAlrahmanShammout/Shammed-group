import type { ReactElement } from 'react';

import { ApiError } from '@/api/api-error';
import { CompanySettingsForm } from '@/features/settings/components/company-settings-form';
import { useAdminSiteSettingsQuery } from '@/features/settings/hooks/use-admin-site-settings-query';

export function AdminCompanySettingsPage(): ReactElement {
  const settingsQuery = useAdminSiteSettingsQuery();
  if (settingsQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Settings</h1>
        <p role="status">Loading settings…</p>
      </div>
    );
  }
  if (settingsQuery.isError) {
    const isNotFound =
      settingsQuery.error instanceof ApiError && settingsQuery.error.statusCode === 404;
    if (!isNotFound) {
      return (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-medium">Settings</h1>
          <p className="text-destructive" role="alert">
            Unable to load settings.
          </p>
        </div>
      );
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Settings</h1>
        <p className="text-muted-foreground">Manage company identity and brand media references.</p>
      </div>
      <CompanySettingsForm siteSettings={settingsQuery.data?.siteSettings} />
    </div>
  );
}
