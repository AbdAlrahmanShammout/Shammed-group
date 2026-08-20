import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { deleteAdminPartner } from '@/features/partners-admin/api/partners.api';

export function useDeleteAdminPartnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (partnerId: number) => deleteAdminPartner(partnerId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.partners() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.partners() });
    },
  });
}
