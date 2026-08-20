import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminMediaList } from '@/features/media-admin/api/media.api';

const DEFAULT_LIMIT = 60;

export function useAdminMediaQuery(offset = 0) {
  return useQuery({
    queryKey: queryKeys.admin.media({ limit: DEFAULT_LIMIT, offset }),
    queryFn: () => getAdminMediaList(DEFAULT_LIMIT, offset),
    retry: false,
  });
}

export { DEFAULT_LIMIT as ADMIN_MEDIA_PAGE_SIZE };
