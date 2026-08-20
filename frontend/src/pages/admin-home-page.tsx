import type { ReactElement } from 'react';

import { Button } from '@/components/ui/button';
import { useAdminSessionQuery } from '@/features/auth/hooks/use-admin-session-query';

type AdminHomePageProps = {
  readonly accessToken: string;
  readonly onSignOut: () => void;
};

export function AdminHomePage({ accessToken, onSignOut }: AdminHomePageProps): ReactElement {
  const sessionQuery = useAdminSessionQuery(accessToken);
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-6 p-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">Admin</h1>
        <Button onClick={onSignOut} type="button" variant="outline">
          Sign out
        </Button>
      </header>
      {sessionQuery.isPending ? <p>Loading session…</p> : null}
      {sessionQuery.isError ? (
        <p className="text-destructive" role="alert">
          Unable to load the current session.
        </p>
      ) : null}
      {sessionQuery.data ? <p>Signed in as {sessionQuery.data.role}.</p> : null}
    </main>
  );
}
