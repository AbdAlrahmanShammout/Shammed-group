/**
 * Wire types for admin social-link operations on the admin OpenAPI document.
 * Keep aligned with /admin/social-link.
 * Do not import backend source types.
 */
export type SocialLinkResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly platform: string;
  readonly url: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

export type SocialLinkResponseDto = {
  readonly socialLink: SocialLinkResponse;
};

export type GetSocialLinksResponseDto = {
  readonly socialLinks: readonly SocialLinkResponse[];
  readonly total: number;
};

export type CreateSocialLinkRequestDto = {
  readonly platform: string;
  readonly url: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
};

export type UpdateSocialLinkRequestDto = {
  readonly platform?: string;
  readonly url?: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
};

export type DeleteSocialLinkResponseDto = {
  readonly message: string;
  readonly status: string;
};
