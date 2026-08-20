import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AdminHomeRoute } from '@/app/admin-home-route';
import { AdminLoginRoute } from '@/app/admin-login-route';
import { GuestAdminRoute } from '@/app/guest-admin-route';
import { RequireAdminSession } from '@/app/require-admin-session';
import { appPaths } from '@/config/app-paths';
import { PublicSiteShell } from '@/features/site-chrome/components/public-site-shell';
import { AboutPage } from '@/pages/about-page';
import { ContactPage } from '@/pages/contact-page';
import { HomePage } from '@/pages/home-page';
import { PartnersPage } from '@/pages/partners-page';
import { ProductsPage } from '@/pages/products-page';
import { ServicesPage } from '@/pages/services-page';

export function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route element={<PublicSiteShell />}>
        <Route element={<HomePage />} path={appPaths.home} />
        <Route element={<AboutPage />} path={appPaths.about} />
        <Route element={<PartnersPage />} path={appPaths.partners} />
        <Route element={<ProductsPage />} path={appPaths.products} />
        <Route element={<ServicesPage />} path={appPaths.services} />
        <Route element={<ContactPage />} path={appPaths.contact} />
      </Route>
      <Route element={<GuestAdminRoute />}>
        <Route element={<AdminLoginRoute />} path={appPaths.adminLogin} />
      </Route>
      <Route element={<RequireAdminSession />}>
        <Route element={<AdminHomeRoute />} path={appPaths.adminHome} />
      </Route>
    </Routes>
  );
}
