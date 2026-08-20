import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/api/query-keys';
import { getAdminContactInquiries } from '@/features/contact-inquiries-admin/api/contact-inquiries.api';
import type { EmailDeliveryStatus } from '@/generated/admin-contact-inquiry.contract';

type UseAdminContactInquiriesQueryParams = {
  readonly limit: number;
  readonly offset: number;
  readonly status?: EmailDeliveryStatus;
};

export function useAdminContactInquiriesQuery(params: UseAdminContactInquiriesQueryParams) {
  return useQuery({
    queryKey: queryKeys.admin.contactInquiries(params),
    queryFn: () => getAdminContactInquiries(params),
  });
}
