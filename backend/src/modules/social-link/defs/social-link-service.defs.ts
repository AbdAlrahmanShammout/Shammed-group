export type CreateSocialLinkServiceInput = {
  readonly platform: string;
  readonly url: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
};

export type UpdateSocialLinkServiceInput = {
  readonly id: number;
  readonly platform?: string;
  readonly url?: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
};

export type GetSocialLinksServiceInput = {
  readonly isVisible?: boolean;
  readonly limit?: number;
  readonly offset?: number;
};
