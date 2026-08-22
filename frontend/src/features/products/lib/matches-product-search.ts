type SearchableProduct = {
  readonly name: string;
  readonly shortDescription: string;
  readonly detailedDescription?: string;
  readonly manufacturer?: string;
};

export function matchesProductSearch(product: SearchableProduct, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) {
    return true;
  }
  const fields = [
    product.name,
    product.shortDescription,
    product.detailedDescription ?? '',
    product.manufacturer ?? '',
  ];
  return fields.some((field) => field.toLowerCase().includes(normalizedQuery));
}
