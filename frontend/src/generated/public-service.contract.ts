/**
 * Wire types for GET /service.
 * Keep aligned with the public Service OpenAPI document.
 * Do not import backend source types.
 */
import type { MediaResponse } from '@/generated/public-site.contract';

export type ServiceResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly title: string;
  readonly description: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly imageMediaId?: number;
  readonly image?: MediaResponse;
};

export type GetServicesResponseDto = {
  readonly services: readonly ServiceResponse[];
  readonly total: number;
};
