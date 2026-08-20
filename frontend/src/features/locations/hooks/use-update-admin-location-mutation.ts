import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { updateAdminLocation } from '@/features/locations/api/locations.api';
import type { UpdateLocationRequestDto } from '@/generated/admin-location.contract';

export function useUpdateAdminLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { readonly locationId: number; readonly body: UpdateLocationRequestDto }) =>
      updateAdminLocation(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.locations() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.locations() });
    },
  });
}
