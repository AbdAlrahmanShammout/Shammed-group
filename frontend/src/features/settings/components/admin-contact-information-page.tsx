import type { ReactElement } from 'react';

import { ApiError } from '@/api/api-error';
import { ContactInformationForm } from '@/features/settings/components/contact-information-form';
import { useAdminSiteSettingsQuery } from '@/features/settings/hooks/use-admin-site-settings-query';

export function AdminContactInformationPage(): ReactElement {
  const settingsQuery = useAdminSiteSettingsQuery();
  if (settingsQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Contact Information</h1>
        <p role="status">Loading contact information…</p>
      </div>
    );
  }
  if (settingsQuery.isError || !settingsQuery.data) {
    const isNotFound =
      settingsQuery.error instanceof ApiError && settingsQuery.error.statusCode === 404;
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Contact Information</h1>
        <p className="text-destructive" role="alert">
          {isNotFound
            ? 'Create website settings first, then edit contact information here.'
            : 'Unable to load contact information.'}
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Contact Information</h1>
        <p className="text-muted-foreground">Manage the main email, phone, WhatsApp, and address.</p>
      </div>
      <ContactInformationForm siteSettings={settingsQuery.data.siteSettings} />
    </div>
  );
}
