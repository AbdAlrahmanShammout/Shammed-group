import type { ReactElement } from 'react';

import { ApiError } from '@/api/api-error';
import { AboutPageForm } from '@/features/about-admin/components/about-page-form';
import { useAdminAboutPageQuery } from '@/features/about-admin/hooks/use-admin-about-page-query';

export function AdminAboutCmsPage(): ReactElement {
  const aboutPageQuery = useAdminAboutPageQuery();
  if (aboutPageQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">About Us</h1>
        <p role="status">Loading about page…</p>
      </div>
    );
  }
  if (aboutPageQuery.isError) {
    const isNotFound =
      aboutPageQuery.error instanceof ApiError && aboutPageQuery.error.statusCode === 404;
    if (!isNotFound) {
      return (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-medium">About Us</h1>
          <p className="text-destructive" role="alert">
            Unable to load the about page.
          </p>
        </div>
      );
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">About Us</h1>
        <p className="text-muted-foreground">
          Edit overview, vision, mission, values, and capabilities as free-form content.
        </p>
      </div>
      <AboutPageForm aboutPage={aboutPageQuery.data?.aboutPage} />
    </div>
  );
}
