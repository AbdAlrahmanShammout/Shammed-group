import { appPaths } from '@/config/app-paths';

export const publicNavItems = [
  { label: 'Home', path: appPaths.home },
  { label: 'About Us', path: appPaths.about },
  { label: 'Partners', path: appPaths.partners },
  { label: 'Products', path: appPaths.products },
  { label: 'Services', path: appPaths.services },
  { label: 'Contact Us', path: appPaths.contact },
] as const;
