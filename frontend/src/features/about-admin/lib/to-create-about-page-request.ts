import { toOptionalMediaId } from '@/features/about-admin/lib/to-optional-media-id';
import type { AboutPageFormValues } from '@/features/about-admin/schemas/about-page-form.schema';
import type { CreateAboutPageRequestDto } from '@/generated/admin-about.contract';

export function toCreateAboutPageRequest(values: AboutPageFormValues): CreateAboutPageRequestDto {
  const overviewImageMediaId = toOptionalMediaId(values.overviewImageMediaId);
  return {
    overview: values.overview,
    overviewImageMediaId: overviewImageMediaId ?? undefined,
    vision: values.vision,
    mission: values.mission,
    values: values.values,
    capabilities: values.capabilities,
  };
}
