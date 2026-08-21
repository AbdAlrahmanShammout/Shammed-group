import { useState, type ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { PageSeo } from '@/components/seo/page-seo';
import { appPaths } from '@/config/app-paths';
import { findPublicPageSeo } from '@/config/public-page-seo';
import { ProductCategoryFilter } from '@/features/products/components/product-category-filter';
import { ProductListItem } from '@/features/products/components/product-list-item';
import { usePublicProductCategoriesQuery } from '@/features/products/hooks/use-public-product-categories-query';
import { usePublicProductsQuery } from '@/features/products/hooks/use-public-products-query';
import { parseCategoryIdSearchParam } from '@/features/products/lib/parse-category-id-search-param';
import type { ProductResponse } from '@/generated/public-product.contract';

const PAGE_SIZE = 24;
const productsSeo = findPublicPageSeo(appPaths.products);

export function PublicProductsPage(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = parseCategoryIdSearchParam(searchParams.get('categoryId'));

  const [offset, setOffset] = useState(0);
  const [accumulated, setAccumulated] = useState<ProductResponse[]>([]);

  const categoriesQuery = usePublicProductCategoriesQuery();
  const productsQuery = usePublicProductsQuery({
    categoryId: selectedCategoryId,
    limit: PAGE_SIZE,
    offset,
  });

  // Merge newly fetched page into accumulated list (avoid duplicates by id)
  const fetchedProducts = productsQuery.data?.products ?? [];
  const total = productsQuery.data?.total ?? 0;

  const mergedIds = new Set(accumulated.map((p) => p.id));
  const newItems = fetchedProducts.filter((p) => !mergedIds.has(p.id));
  const allProducts = newItems.length > 0 ? [...accumulated, ...newItems] : accumulated;

  const hasMore = allProducts.length < total;

  function onSelectCategoryId(categoryId: number | undefined): void {
    setOffset(0);
    setAccumulated([]);
    if (categoryId === undefined) {
      setSearchParams({});
      return;
    }
    setSearchParams({ categoryId: String(categoryId) });
  }

  function handleLoadMore(): void {
    setAccumulated(allProducts);
    setOffset((prev) => prev + PAGE_SIZE);
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:px-6">
      {productsSeo ? (
        <PageSeo
          description={productsSeo.description}
          path={productsSeo.path}
          title={productsSeo.title}
        />
      ) : null}

      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-3xl font-medium">Products</h1>
        {total > 0 ? (
          <span className="text-sm text-muted-foreground">
            {allProducts.length} of {total}
          </span>
        ) : null}
      </div>

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

      {productsQuery.isPending && allProducts.length === 0 ? (
        <p role="status">Loading products…</p>
      ) : null}
      {productsQuery.isError ? <p role="alert">Unable to load products.</p> : null}

      {allProducts.length === 0 && !productsQuery.isPending ? (
        <p role="status">No products are available for this selection.</p>
      ) : null}

      {allProducts.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allProducts.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </ul>
      ) : null}

      {hasMore ? (
        <div className="flex justify-center pt-4">
          <Button
            disabled={productsQuery.isFetching}
            onClick={handleLoadMore}
            size="lg"
            variant="outline"
          >
            {productsQuery.isFetching ? 'Loading…' : `Load more (${total - allProducts.length} remaining)`}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
