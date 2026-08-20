import { toOptionalMediaId } from '@/features/services-admin/lib/to-optional-media-id';
import type { ServiceFormValues } from '@/features/services-admin/schemas/service-form.schema';
import type { CreateServiceRequestDto } from '@/generated/admin-service.contract';

export function toCreateServiceRequest(values: ServiceFormValues): CreateServiceRequestDto {
  const imageMediaId = toOptionalMediaId(values.imageMediaId);
  return {
    title: values.title,
    description: values.description,
    isVisible: values.isVisible,
    displayOrder: values.displayOrder === '' ? 0 : Number(values.displayOrder),
    imageMediaId: imageMediaId ?? undefined,
  };
}
