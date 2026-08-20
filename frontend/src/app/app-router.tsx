import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from '@/app/app-routes';
import { AuthSessionProvider } from '@/app/auth-session-provider';

export function AppRouter(): ReactElement {
  return (
    <BrowserRouter>
      <AuthSessionProvider>
        <AppRoutes />
      </AuthSessionProvider>
    </BrowserRouter>
  );
}
