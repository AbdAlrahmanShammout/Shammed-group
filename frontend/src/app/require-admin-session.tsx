import type { ReactElement } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthSession } from '@/app/use-auth-session';
import { appPaths } from '@/config/app-paths';

export function RequireAdminSession(): ReactElement {
  const { accessToken } = useAuthSession();
  const location = useLocation();
  if (!accessToken) {
    return <Navigate replace state={{ from: location }} to={appPaths.adminLogin} />;
  }
  return <Outlet />;
}
