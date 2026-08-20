import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { updateAdminPartner } from '@/features/partners-admin/api/partners.api';
import type { UpdatePartnerRequestDto } from '@/generated/admin-partner.contract';

export function useUpdateAdminPartnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { readonly partnerId: number; readonly body: UpdatePartnerRequestDto }) =>
      updateAdminPartner(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.partners() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.partners() });
    },
  });
}
