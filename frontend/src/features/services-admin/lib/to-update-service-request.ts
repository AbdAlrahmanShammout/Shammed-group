import { toOptionalMediaId } from '@/features/services-admin/lib/to-optional-media-id';
import type { ServiceFormValues } from '@/features/services-admin/schemas/service-form.schema';
import type { UpdateServiceRequestDto } from '@/generated/admin-service.contract';

export function toUpdateServiceRequest(values: ServiceFormValues): UpdateServiceRequestDto {
  return {
    title: values.title,
    description: values.description,
    isVisible: values.isVisible,
    displayOrder: values.displayOrder === '' ? 0 : Number(values.displayOrder),
    imageMediaId: toOptionalMediaId(values.imageMediaId),
  };
}
