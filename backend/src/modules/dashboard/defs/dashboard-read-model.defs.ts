export type CatalogCount = {
  readonly total: number;
  readonly visible: number;
  readonly hidden: number;
};

export type DashboardStatistics = {
  readonly products: CatalogCount;
  readonly categories: CatalogCount;
  readonly partners: CatalogCount;
  readonly services: CatalogCount;
};
