import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { deleteAdminService } from '@/features/services-admin/api/services.api';

export function useDeleteAdminServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceId: number) => deleteAdminService(serviceId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.services() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.services() });
    },
  });
}
