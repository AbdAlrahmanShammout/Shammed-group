import type { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthSession } from '@/app/use-auth-session';
import { appPaths } from '@/config/app-paths';

export function GuestAdminRoute(): ReactElement {
  const { accessToken } = useAuthSession();
  if (accessToken) {
    return <Navigate replace to={appPaths.adminHome} />;
  }
  return <Outlet />;
}
