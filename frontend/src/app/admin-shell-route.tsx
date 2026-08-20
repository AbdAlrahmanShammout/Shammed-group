import type { ReactElement } from 'react';

import { useAuthSession } from '@/app/use-auth-session';
import { AdminShell } from '@/components/layout/admin-shell';

export function AdminShellRoute(): ReactElement | null {
  const { accessToken, signOut } = useAuthSession();
  if (!accessToken) {
    return null;
  }
  return <AdminShell onSignOut={signOut} />;
}
