import { PartnerEntity } from '@/modules/partner/entity/partner.entity';

export type CreatePartnerRepoInput = {
  readonly name: string;
  readonly shortDescription: string;
  readonly fullDescription: string | null;
  readonly specialization: string | null;
  readonly websiteUrl: string | null;
  readonly country: string | null;
  readonly isVisible: boolean;
  readonly displayOrder: number;
  readonly logoMediaId: number | null;
};

export type UpdatePartnerRepoInput = {
  readonly id: number;
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

export type GetPartnersRepoInput = {
  readonly isVisible?: boolean;
  readonly limit: number;
  readonly offset: number;
};

export type PartnerPage = {
  readonly entities: PartnerEntity[];
  readonly total: number;
};
