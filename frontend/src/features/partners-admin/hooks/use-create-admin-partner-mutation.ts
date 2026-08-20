import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { createAdminPartner } from '@/features/partners-admin/api/partners.api';
import type { CreatePartnerRequestDto } from '@/generated/admin-partner.contract';

export function useCreateAdminPartnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePartnerRequestDto) => createAdminPartner(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.partners() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.public.partners() });
    },
  });
}
