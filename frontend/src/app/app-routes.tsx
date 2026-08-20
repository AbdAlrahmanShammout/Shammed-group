import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AdminHomeRoute } from '@/app/admin-home-route';
import { AdminLoginRoute } from '@/app/admin-login-route';
import { GuestAdminRoute } from '@/app/guest-admin-route';
import { RequireAdminSession } from '@/app/require-admin-session';
import { appPaths } from '@/config/app-paths';
import { RootPage } from '@/pages/root-page';

export function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route element={<RootPage />} path={appPaths.root} />
      <Route element={<GuestAdminRoute />}>
        <Route element={<AdminLoginRoute />} path={appPaths.adminLogin} />
      </Route>
      <Route element={<RequireAdminSession />}>
        <Route element={<AdminHomeRoute />} path={appPaths.adminHome} />
      </Route>
    </Routes>
  );
}
