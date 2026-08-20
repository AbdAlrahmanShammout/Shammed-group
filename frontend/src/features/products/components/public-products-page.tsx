import type { ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ProductCategoryFilter } from '@/features/products/components/product-category-filter';
import { ProductListItem } from '@/features/products/components/product-list-item';
import { usePublicProductCategoriesQuery } from '@/features/products/hooks/use-public-product-categories-query';
import { usePublicProductsQuery } from '@/features/products/hooks/use-public-products-query';
import { parseCategoryIdSearchParam } from '@/features/products/lib/parse-category-id-search-param';

export function PublicProductsPage(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = parseCategoryIdSearchParam(searchParams.get('categoryId'));
  const categoriesQuery = usePublicProductCategoriesQuery();
  const productsQuery = usePublicProductsQuery({ categoryId: selectedCategoryId });
  function onSelectCategoryId(categoryId: number | undefined): void {
    if (categoryId === undefined) {
      setSearchParams({});
      return;
    }
    setSearchParams({ categoryId: String(categoryId) });
  }
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:px-6">
      <h1 className="text-3xl font-medium">Products</h1>
      {categoriesQuery.isPending ? <p role="status">Loading categories…</p> : null}
      {categoriesQuery.isError ? (
        <p role="alert">Unable to load product categories.</p>
      ) : null}
      {categoriesQuery.data ? (
        <ProductCategoryFilter
          categories={categoriesQuery.data.productCategories}
          onSelectCategoryId={onSelectCategoryId}
          selectedCategoryId={selectedCategoryId}
        />
      ) : null}
      {productsQuery.isPending ? <p role="status">Loading products…</p> : null}
      {productsQuery.isError ? <p role="alert">Unable to load products.</p> : null}
      {productsQuery.data && productsQuery.data.products.length === 0 ? (
        <p role="status">No products are available for this selection.</p>
      ) : null}
      {productsQuery.data && productsQuery.data.products.length > 0 ? (
        <ul>
          {productsQuery.data.products.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
