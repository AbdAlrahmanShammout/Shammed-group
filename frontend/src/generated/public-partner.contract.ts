/**
 * Wire types for GET /partner.
 * Keep aligned with the public Partner OpenAPI document.
 * Do not import backend source types.
 */
import type { MediaResponse } from '@/generated/public-site.contract';

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

export type GetPartnersResponseDto = {
  readonly partners: readonly PartnerResponse[];
  readonly total: number;
};
