/**
 * Wire types for admin dashboard statistics on the admin OpenAPI document.
 * Keep aligned with GET /admin/dashboard.
 * Do not import backend source types.
 */
export type CatalogCountResponse = {
  readonly total: number;
  readonly visible: number;
  readonly hidden: number;
};

export type DashboardStatisticsResponse = {
  readonly products: CatalogCountResponse;
  readonly categories: CatalogCountResponse;
  readonly partners: CatalogCountResponse;
  readonly services: CatalogCountResponse;
};

export type DashboardStatisticsResponseDto = {
  readonly statistics: DashboardStatisticsResponse;
};
