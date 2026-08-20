import { toOptionalMediaId } from '@/features/about-admin/lib/to-optional-media-id';
import type { AboutPageFormValues } from '@/features/about-admin/schemas/about-page-form.schema';
import type { UpdateAboutPageRequestDto } from '@/generated/admin-about.contract';

export function toUpdateAboutPageRequest(values: AboutPageFormValues): UpdateAboutPageRequestDto {
  return {
    overview: values.overview,
    overviewImageMediaId: toOptionalMediaId(values.overviewImageMediaId),
    vision: values.vision,
    mission: values.mission,
    values: values.values,
    capabilities: values.capabilities,
  };
}
