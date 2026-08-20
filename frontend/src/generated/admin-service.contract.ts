/**
 * Wire types for admin service operations on the admin OpenAPI document.
 * Keep aligned with /admin/service.
 * Do not import backend source types.
 */
import type { MediaResponse } from '@/generated/admin-media.contract';

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

export type ServiceResponseDto = {
  readonly service: ServiceResponse;
};

export type GetServicesResponseDto = {
  readonly services: readonly ServiceResponse[];
  readonly total: number;
};

export type CreateServiceRequestDto = {
  readonly title: string;
  readonly description: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly imageMediaId?: number;
};

export type UpdateServiceRequestDto = {
  readonly title?: string;
  readonly description?: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly imageMediaId?: number | null;
};

export type DeleteServiceResponseDto = {
  readonly message: string;
  readonly status: string;
};
