import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthSession } from '@/app/use-auth-session';
import { appPaths } from '@/config/app-paths';
import { AdminLoginPage } from '@/pages/admin-login-page';

export function AdminLoginRoute(): ReactElement {
  const { signIn } = useAuthSession();
  const navigate = useNavigate();
  return (
    <AdminLoginPage
      onSignedIn={(accessToken) => {
        signIn(accessToken);
        void navigate(appPaths.adminHome, { replace: true });
      }}
    />
  );
}
