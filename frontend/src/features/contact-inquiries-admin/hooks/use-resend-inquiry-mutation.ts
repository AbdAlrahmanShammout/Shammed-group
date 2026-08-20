import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resendContactInquiryNotification } from '@/features/contact-inquiries-admin/api/contact-inquiries.api';

export function useResendInquiryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => resendContactInquiryNotification(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'contact-inquiries'] });
    },
  });
}
