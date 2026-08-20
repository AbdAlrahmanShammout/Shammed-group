import type { ReactElement } from 'react';

import { useAdminSessionQuery } from '@/features/auth/hooks/use-admin-session-query';

type AdminHomePageProps = {
  readonly accessToken: string;
};

export function AdminHomePage({ accessToken }: AdminHomePageProps): ReactElement {
  const sessionQuery = useAdminSessionQuery(accessToken);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-medium">Overview</h1>
      {sessionQuery.isPending ? <p>Loading session…</p> : null}
      {sessionQuery.isError ? (
        <p className="text-destructive" role="alert">
          Unable to load the current session.
        </p>
      ) : null}
      {sessionQuery.data ? <p>Signed in as {sessionQuery.data.role}.</p> : null}
    </div>
  );
}
