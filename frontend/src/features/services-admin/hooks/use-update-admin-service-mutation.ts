import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { updateAdminService } from '@/features/services-admin/api/services.api';
import type { UpdateServiceRequestDto } from '@/generated/admin-service.contract';

export function useUpdateAdminServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { readonly serviceId: number; readonly body: UpdateServiceRequestDto }) =>
      updateAdminService(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.services() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.services() });
    },
  });
}
