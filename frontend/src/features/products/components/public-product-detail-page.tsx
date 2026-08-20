import { ArrowLeft, Building2, ExternalLink, Package, Tag } from 'lucide-react';
import type { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ApiError } from '@/api/api-error';
import { PublicMediaImage } from '@/components/media/public-media-image';
import { PageSeo } from '@/components/seo/page-seo';
import { appPaths } from '@/config/app-paths';
import { usePublicProductQuery } from '@/features/products/hooks/use-public-product-query';
import { createProductDetailPath } from '@/features/products/lib/create-product-detail-path';
import { parseProductIdParam } from '@/features/products/lib/parse-product-id-param';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

function ProductImagePlaceholder(): ReactElement {
  return (
    <div className="flex h-full min-h-64 w-full items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_30%_20%,#E8ECF7,#F5F7FA_72%)]">
      <Package aria-hidden="true" className="h-20 w-20 text-primary/20" />
    </div>
  );
}

export function PublicProductDetailPage(): ReactElement {
  const params = useParams();
  const productId = parseProductIdParam(params.productId);
  const productQuery = usePublicProductQuery(productId);

  if (productId === undefined) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="alert">
        <p className="text-muted-foreground">Product not found.</p>
        <Link
          className={cn('mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline', focusRingClassName)}
          to={appPaths.products}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </div>
    );
  }

  if (productQuery.isPending) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="status">
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-8 w-64 rounded bg-muted" />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square rounded-2xl bg-muted" />
            <div className="flex flex-col gap-3">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted" />
              <div className="h-4 w-4/6 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productQuery.isError || !productQuery.data) {
    const isNotFound = productQuery.error instanceof ApiError && productQuery.error.statusCode === 404;
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="alert">
        <p className="text-muted-foreground">{isNotFound ? 'Product not found.' : 'Unable to load this product.'}</p>
        <Link
          className={cn('mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline', focusRingClassName)}
          to={appPaths.products}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </div>
    );
  }

  const { product } = productQuery.data;

  return (
    <>
      <PageSeo
        description={product.shortDescription}
        path={createProductDetailPath(product.id)}
        title={product.name}
      />

      {/* Page header strip */}
      <div className="border-b bg-[linear-gradient(180deg,#F5F7FA_0%,#FFFFFF_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <Link
            className={cn(
              'inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary',
              focusRingClassName,
            )}
            to={appPaths.products}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All products
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-secondary-foreground">
              <Tag aria-hidden="true" className="h-3 w-3" />
              {product.category.name}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        </div>
      </div>

      {/* Main body */}
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-start lg:gap-14">

          {/* Image panel */}
          <div className="flex flex-col gap-4">
            {product.imageMediaId !== undefined ? (
              <div className="overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-sm">
                <PublicMediaImage
                  alt={product.name}
                  className="aspect-[4/3] w-full object-cover"
                  mediaId={product.imageMediaId}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-border shadow-sm">
                <ProductImagePlaceholder />
              </div>
            )}

            {/* Manufacturer badge */}
            {product.manufacturer ? (
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
                <Building2 aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Manufacturer</p>
                  <p className="text-sm font-semibold text-foreground">{product.manufacturer}</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-6">

            {/* Detailed description */}
            {product.detailedDescription ? (
              <section aria-label="Product details">
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Product details
                </h2>
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                  {product.detailedDescription}
                </p>
              </section>
            ) : null}

            {/* Partner */}
            {product.partner ? (
              <section
                aria-labelledby="product-partner-title"
                className="rounded-xl border border-border bg-secondary/40 p-5"
              >
                <h2
                  className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  id="product-partner-title"
                >
                  Distributed by
                </h2>
                <p className="text-base font-semibold text-foreground">{product.partner.name}</p>
                {product.partner.shortDescription ? (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {product.partner.shortDescription}
                  </p>
                ) : null}
                {product.partner.websiteUrl ? (
                  <a
                    className={cn(
                      'mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:underline',
                      focusRingClassName,
                    )}
                    href={product.partner.websiteUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Visit website
                    <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : null}
              </section>
            ) : null}

            {/* Back link */}
            <div className="pt-2">
              <Link
                className={cn(
                  'inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
                  focusRingClassName,
                )}
                to={appPaths.products}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to all products
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
