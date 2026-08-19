export type CreatePartnerServiceInput = {
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

export type UpdatePartnerServiceInput = {
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

export type GetPartnersServiceInput = {
  readonly isVisible?: boolean;
  readonly limit?: number;
  readonly offset?: number;
};
