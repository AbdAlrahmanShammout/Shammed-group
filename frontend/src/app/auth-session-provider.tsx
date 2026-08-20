import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { queryKeys } from '@/api/query-keys';
import { sessionTokenStore } from '@/api/session-token-store';
import { setUnauthorizedHandler } from '@/api/unauthorized-handler';
import { AuthSessionContext, type AuthSessionValue } from '@/app/auth-session-context';
import { appPaths } from '@/config/app-paths';

type AuthSessionProviderProps = {
  readonly children: ReactNode;
};

export function AuthSessionProvider({ children }: AuthSessionProviderProps): ReactElement {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(() => sessionTokenStore.get());
  const value = useMemo<AuthSessionValue>(() => {
    function signIn(nextAccessToken: string): void {
      sessionTokenStore.set(nextAccessToken);
      setAccessToken(nextAccessToken);
    }
    function signOut(): void {
      sessionTokenStore.clear();
      setAccessToken(null);
      void queryClient.removeQueries({ queryKey: queryKeys.admin.auth.session() });
    }
    return { accessToken, signIn, signOut };
  }, [accessToken, queryClient]);
  useEffect(() => {
    setUnauthorizedHandler(() => {
      value.signOut();
      void navigate(appPaths.adminLogin, { replace: true });
    });
    return () => {
      setUnauthorizedHandler(null);
    };
  }, [navigate, value]);
  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}
