import type { ReactElement } from 'react';

import { ApiError } from '@/api/api-error';
import { HomePageForm } from '@/features/home-admin/components/home-page-form';
import { useAdminHomePageQuery } from '@/features/home-admin/hooks/use-admin-home-page-query';

export function AdminHomeCmsPage(): ReactElement {
  const homePageQuery = useAdminHomePageQuery();
  if (homePageQuery.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Home Page</h1>
        <p role="status">Loading home page…</p>
      </div>
    );
  }
  if (homePageQuery.isError) {
    const isNotFound =
      homePageQuery.error instanceof ApiError && homePageQuery.error.statusCode === 404;
    if (!isNotFound) {
      return (
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-medium">Home Page</h1>
          <p className="text-destructive" role="alert">
            Unable to load the home page.
          </p>
        </div>
      );
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium">Home Page</h1>
        <p className="text-muted-foreground">
          Edit hero, about preview, why Shammed, and section titles. Catalog previews stay driven by
          entity visibility.
        </p>
      </div>
      <HomePageForm homePage={homePageQuery.data?.homePage} />
    </div>
  );
}
