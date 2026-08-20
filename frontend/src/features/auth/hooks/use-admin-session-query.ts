import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminSession } from '@/features/auth/api/auth.api';

export function useAdminSessionQuery(accessToken: string) {
  return useQuery({
    queryKey: queryKeys.admin.auth.session(),
    queryFn: getAdminSession,
    enabled: Boolean(accessToken),
  });
}
