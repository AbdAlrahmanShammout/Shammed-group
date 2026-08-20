import type { ReactElement } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AdminHomeRoute } from '@/app/admin-home-route';
import { AdminLoginRoute } from '@/app/admin-login-route';
import { AdminShellRoute } from '@/app/admin-shell-route';
import { GuestAdminRoute } from '@/app/guest-admin-route';
import { RequireAdminSession } from '@/app/require-admin-session';
import { AdminPlaceholderPage } from '@/components/layout/admin-placeholder-page';
import { appPaths } from '@/config/app-paths';
import { PublicSiteShell } from '@/features/site-chrome/components/public-site-shell';
import { AboutPage } from '@/pages/about-page';
import { AdminContactInformationPage } from '@/pages/admin-contact-information-page';
import { AdminLocationsPage } from '@/pages/admin-locations-page';
import { AdminSocialLinksPage } from '@/pages/admin-social-links-page';
import { AdminWebsiteHomePage } from '@/pages/admin-website-home-page';
import { AdminWebsiteSettingsPage } from '@/pages/admin-website-settings-page';
import { ContactPage } from '@/pages/contact-page';
import { HomePage } from '@/pages/home-page';
import { PartnersPage } from '@/pages/partners-page';
import { ProductDetailPage } from '@/pages/product-detail-page';
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
        <Route element={<ProductDetailPage />} path={appPaths.productDetail} />
        <Route element={<ServicesPage />} path={appPaths.services} />
        <Route element={<ContactPage />} path={appPaths.contact} />
      </Route>
      <Route element={<GuestAdminRoute />}>
        <Route element={<AdminLoginRoute />} path={appPaths.adminLogin} />
      </Route>
      <Route element={<RequireAdminSession />}>
        <Route element={<AdminShellRoute />}>
          <Route element={<AdminHomeRoute />} path={appPaths.adminHome} />
          <Route element={<AdminWebsiteHomePage />} path={appPaths.adminWebsiteHome} />
          <Route
            element={<AdminPlaceholderPage title="About Us" />}
            path={appPaths.adminWebsiteAbout}
          />
          <Route element={<AdminWebsiteSettingsPage />} path={appPaths.adminWebsiteSettings} />
          <Route
            element={<AdminPlaceholderPage title="Categories" />}
            path={appPaths.adminCatalogCategories}
          />
          <Route
            element={<AdminPlaceholderPage title="Products" />}
            path={appPaths.adminCatalogProducts}
          />
          <Route
            element={<AdminPlaceholderPage title="Partners" />}
            path={appPaths.adminCompanyPartners}
          />
          <Route
            element={<AdminPlaceholderPage title="Services" />}
            path={appPaths.adminCompanyServices}
          />
          <Route element={<AdminLocationsPage />} path={appPaths.adminContactLocations} />
          <Route
            element={<AdminContactInformationPage />}
            path={appPaths.adminContactInformation}
          />
          <Route element={<AdminSocialLinksPage />} path={appPaths.adminContactSocial} />
        </Route>
      </Route>
    </Routes>
  );
}
