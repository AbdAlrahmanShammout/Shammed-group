import { useEffect, useState, type ReactElement } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { PageSeo } from '@/components/seo/page-seo';
import { appPaths } from '@/config/app-paths';
import { findPublicPageSeo } from '@/config/public-page-seo';
import { usePublicPartnersQuery } from '@/features/partners/hooks/use-public-partners-query';
import { ProductCategoryFilter } from '@/features/products/components/product-category-filter';
import { ProductListItem } from '@/features/products/components/product-list-item';
import { ProductPartnerFilter } from '@/features/products/components/product-partner-filter';
import { ProductSearchField } from '@/features/products/components/product-search-field';
import { usePublicProductCategoriesQuery } from '@/features/products/hooks/use-public-product-categories-query';
import { usePublicProductsQuery } from '@/features/products/hooks/use-public-products-query';
import { buildProductFilterSearchParams } from '@/features/products/lib/build-product-filter-search-params';
import { parseCategoryIdSearchParam } from '@/features/products/lib/parse-category-id-search-param';
import { parsePartnerIdSearchParam } from '@/features/products/lib/parse-partner-id-search-param';
import type { ProductResponse } from '@/generated/public-product.contract';

const PAGE_SIZE = 24;
const SEARCH_DEBOUNCE_MS = 300;
const productsSeo = findPublicPageSeo(appPaths.products);

export function PublicProductsPage(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = parseCategoryIdSearchParam(searchParams.get('categoryId'));
  const selectedPartnerId = parsePartnerIdSearchParam(searchParams.get('partnerId'));
  const searchQuery = searchParams.get('search') ?? '';

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [offset, setOffset] = useState(0);
  const [accumulated, setAccumulated] = useState<ProductResponse[]>([]);

  const categoriesQuery = usePublicProductCategoriesQuery();
  const partnersQuery = usePublicPartnersQuery();
  const productsQuery = usePublicProductsQuery({
    categoryId: selectedCategoryId,
    partnerId: selectedPartnerId,
    search: searchQuery.trim().length > 0 ? searchQuery.trim() : undefined,
    limit: PAGE_SIZE,
    offset,
  });

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trimmedSearch = searchInput.trim();
      if (trimmedSearch === searchQuery.trim()) {
        return;
      }
      setSearchParams(
        buildProductFilterSearchParams({
          categoryId: selectedCategoryId,
          partnerId: selectedPartnerId,
          search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
        }),
      );
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchInput, searchQuery, selectedCategoryId, selectedPartnerId, setSearchParams]);

  const filterKey = `${selectedCategoryId ?? 'all'}-${selectedPartnerId ?? 'all'}-${searchQuery.trim()}`;
  useEffect(() => {
    setOffset(0);
    setAccumulated([]);
  }, [filterKey]);

  const fetchedProducts = productsQuery.data?.products ?? [];
  const total = productsQuery.data?.total ?? 0;

  const mergedIds = new Set(accumulated.map((product) => product.id));
  const newItems = fetchedProducts.filter((product) => !mergedIds.has(product.id));
  const allProducts = newItems.length > 0 ? [...accumulated, ...newItems] : accumulated;

  const hasMore = allProducts.length < total;

  function updateFilters(filters: {
    readonly categoryId?: number;
    readonly partnerId?: number;
    readonly search?: string;
  }): void {
    setSearchParams(buildProductFilterSearchParams(filters));
  }

  function onSelectCategoryId(categoryId: number | undefined): void {
    updateFilters({
      categoryId,
      partnerId: selectedPartnerId,
      search: searchQuery.trim().length > 0 ? searchQuery.trim() : undefined,
    });
  }

  function onSelectPartnerId(partnerId: number | undefined): void {
    updateFilters({
      categoryId: selectedCategoryId,
      partnerId,
      search: searchQuery.trim().length > 0 ? searchQuery.trim() : undefined,
    });
  }

  function handleLoadMore(): void {
    setAccumulated(allProducts);
    setOffset((previousOffset) => previousOffset + PAGE_SIZE);
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

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ProductSearchField onChange={setSearchInput} value={searchInput} />
        {partnersQuery.isPending ? <p role="status">Loading partners…</p> : null}
        {partnersQuery.isError ? <p role="alert">Unable to load partners.</p> : null}
        {partnersQuery.data && partnersQuery.data.partners.length > 0 ? (
          <ProductPartnerFilter
            onSelectPartnerId={onSelectPartnerId}
            partners={partnersQuery.data.partners}
            selectedPartnerId={selectedPartnerId}
          />
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
