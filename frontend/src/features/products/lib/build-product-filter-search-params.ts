type ProductFilterSearchParams = {
  readonly categoryId?: number;
  readonly partnerId?: number;
  readonly search?: string;
};

export function buildProductFilterSearchParams(
  filters: ProductFilterSearchParams,
): Record<string, string> {
  const params: Record<string, string> = {};
  if (filters.categoryId !== undefined) {
    params.categoryId = String(filters.categoryId);
  }
  if (filters.partnerId !== undefined) {
    params.partnerId = String(filters.partnerId);
  }
  if (filters.search !== undefined && filters.search.length > 0) {
    params.search = filters.search;
  }
  return params;
}
