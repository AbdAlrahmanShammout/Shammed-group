import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { createAdminService } from '@/features/services-admin/api/services.api';
import type { CreateServiceRequestDto } from '@/generated/admin-service.contract';

export function useCreateAdminServiceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateServiceRequestDto) => createAdminService(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.services() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.services() });
    },
  });
}
