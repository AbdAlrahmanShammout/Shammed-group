import { SocialLinkEntity } from '@/modules/social-link/entity/social-link.entity';

export type CreateSocialLinkRepoInput = {
  readonly platform: string;
  readonly url: string;
  readonly isVisible: boolean;
  readonly displayOrder: number;
};

export type UpdateSocialLinkRepoInput = {
  readonly id: number;
  readonly platform?: string;
  readonly url?: string;
  readonly isVisible?: boolean;
  readonly displayOrder?: number;
};

export type GetSocialLinksRepoInput = {
  readonly isVisible?: boolean;
  readonly limit: number;
  readonly offset: number;
};

export type SocialLinkPage = {
  readonly entities: SocialLinkEntity[];
  readonly total: number;
};
