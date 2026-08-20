import type { ReactElement } from 'react';

import { useAuthSession } from '@/app/use-auth-session';
import { AdminHomePage } from '@/pages/admin-home-page';

export function AdminHomeRoute(): ReactElement | null {
  const { accessToken, signOut } = useAuthSession();
  if (!accessToken) {
    return null;
  }
  return <AdminHomePage accessToken={accessToken} onSignOut={signOut} />;
}
