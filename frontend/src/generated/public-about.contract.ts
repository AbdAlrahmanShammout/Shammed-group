/**
 * Wire types for GET /about-page.
 * Keep aligned with the public About OpenAPI document.
 * Do not import backend source types.
 */
import type { MediaResponse } from '@/generated/public-site.contract';

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
