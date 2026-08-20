import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { createAdminLocation } from '@/features/locations/api/locations.api';
import type { CreateLocationRequestDto } from '@/generated/admin-location.contract';

export function useCreateAdminLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLocationRequestDto) => createAdminLocation(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.locations() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.locations() });
    },
  });
}
