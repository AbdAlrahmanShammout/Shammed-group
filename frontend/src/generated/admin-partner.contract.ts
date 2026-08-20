/**
 * Wire types for admin partner operations on the admin OpenAPI document.
 * Keep aligned with /admin/partner.
 * Do not import backend source types.
 */
import type { MediaResponse } from '@/generated/admin-media.contract';

export type PartnerResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly name: string;
  readonly shortDescription: string;
  readonly fullDescription?: string;
  readonly specialization?: string;
  readonly websiteUrl?: string;
  readonly country?: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly logoMediaId?: number;
  readonly logo?: MediaResponse;
};

export type PartnerResponseDto = {
  readonly partner: PartnerResponse;
};

export type GetPartnersResponseDto = {
  readonly partners: readonly PartnerResponse[];
  readonly total: number;
};

export type CreatePartnerRequestDto = {
  readonly name: string;
  readonly shortDescription: string;
  readonly fullDescription?: string;
  readonly specialization?: string;
  readonly websiteUrl?: string;
  readonly country?: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly logoMediaId?: number;
};

export type UpdatePartnerRequestDto = {
  readonly name?: string;
  readonly shortDescription?: string;
  readonly fullDescription?: string | null;
  readonly specialization?: string | null;
  readonly websiteUrl?: string | null;
  readonly country?: string | null;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
  readonly logoMediaId?: number | null;
};

export type DeletePartnerResponseDto = {
  readonly message: string;
  readonly status: string;
};
