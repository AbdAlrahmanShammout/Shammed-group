import type { AdminNavGroup } from '@/components/layout/admin-nav-item';
import { appPaths } from '@/config/app-paths';

export const adminNavGroups: readonly AdminNavGroup[] = [
  {
    label: 'Dashboard',
    items: [{ label: 'Overview', path: appPaths.adminHome }],
  },
  {
    label: 'Website',
    items: [
      { label: 'Home Page', path: appPaths.adminWebsiteHome },
      { label: 'About Us', path: appPaths.adminWebsiteAbout },
      { label: 'Settings', path: appPaths.adminWebsiteSettings },
      { label: 'Brand Colors', path: appPaths.adminThemeSettings },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Categories', path: appPaths.adminCatalogCategories },
      { label: 'Products', path: appPaths.adminCatalogProducts },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'Partners', path: appPaths.adminCompanyPartners },
      { label: 'Services', path: appPaths.adminCompanyServices },
    ],
  },
  {
    label: 'Contact',
    items: [
      { label: 'Inquiries', path: appPaths.adminContactInquiries },
      { label: 'Locations', path: appPaths.adminContactLocations },
      { label: 'Contact Information', path: appPaths.adminContactInformation },
      { label: 'Social Media', path: appPaths.adminContactSocial },
    ],
  },
  {
    label: 'System',
    items: [{ label: 'Media Library', path: appPaths.adminMedia }],
  },
] as const;
