/**
 * Wire types for admin about-page CMS on the admin OpenAPI document.
 * Keep aligned with /admin/about-page.
 * Do not import backend source types.
 */
import type { MediaResponse } from '@/generated/admin-media.contract';

export type AboutPageResponse = {
  readonly id: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly overview: string;
  readonly overviewImageMediaId?: number;
  readonly vision: string;
  readonly mission: string;
  readonly values: string;
  readonly capabilities: string;
  readonly overviewImage?: MediaResponse;
};

export type AboutPageResponseDto = {
  readonly aboutPage: AboutPageResponse;
};

export type CreateAboutPageRequestDto = {
  readonly overview: string;
  readonly overviewImageMediaId?: number;
  readonly vision: string;
  readonly mission: string;
  readonly values: string;
  readonly capabilities: string;
};

export type UpdateAboutPageRequestDto = {
  readonly overview?: string;
  readonly overviewImageMediaId?: number | null;
  readonly vision?: string;
  readonly mission?: string;
  readonly values?: string;
  readonly capabilities?: string;
};
