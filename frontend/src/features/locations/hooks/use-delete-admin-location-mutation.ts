import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { deleteAdminLocation } from '@/features/locations/api/locations.api';

export function useDeleteAdminLocationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (locationId: number) => deleteAdminLocation(locationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.locations() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.locations() });
    },
  });
}
