import type { ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ApiError } from '@/api/api-error';
import { PageSeo } from '@/components/seo/page-seo';
import { appPaths } from '@/config/app-paths';
import { usePublicProductQuery } from '@/features/products/hooks/use-public-product-query';
import { createProductDetailPath } from '@/features/products/lib/create-product-detail-path';
import { parseProductIdParam } from '@/features/products/lib/parse-product-id-param';

export function PublicProductDetailPage(): ReactElement {
  const params = useParams();
  const productId = parseProductIdParam(params.productId);
  const productQuery = usePublicProductQuery(productId);
  if (productId === undefined) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="alert">
        <p>Product not found.</p>
        <Link className="mt-4 inline-block text-sm font-medium underline-offset-4 hover:underline" to={appPaths.products}>
          Back to products
        </Link>
      </div>
    );
  }
  if (productQuery.isPending) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="status">
        Loading product…
      </div>
    );
  }
  if (productQuery.isError || !productQuery.data) {
    const isNotFound = productQuery.error instanceof ApiError && productQuery.error.statusCode === 404;
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6" role="alert">
        <p>{isNotFound ? 'Product not found.' : 'Unable to load this product.'}</p>
        <Link className="mt-4 inline-block text-sm font-medium underline-offset-4 hover:underline" to={appPaths.products}>
          Back to products
        </Link>
      </div>
    );
  }
  const { product } = productQuery.data;
  return (
    <article className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 md:px-6">
      <PageSeo
        description={product.shortDescription}
        path={createProductDetailPath(product.id)}
        title={product.name}
      />
      <Link className="text-sm font-medium underline-offset-4 hover:underline" to={appPaths.products}>
        Back to products
      </Link>
      <h1 className="text-3xl font-medium">{product.name}</h1>
      <p className="text-sm text-muted-foreground">{product.category.name}</p>
      <p className="text-muted-foreground">{product.shortDescription}</p>
      {product.detailedDescription ? (
        <p className="max-w-3xl whitespace-pre-wrap text-muted-foreground">{product.detailedDescription}</p>
      ) : null}
      {product.manufacturer ? (
        <p className="text-sm text-muted-foreground">Manufacturer: {product.manufacturer}</p>
      ) : null}
      {product.partner ? (
        <section aria-labelledby="product-partner-title" className="flex flex-col gap-2">
          <h2 className="text-xl font-medium" id="product-partner-title">
            Associated partner
          </h2>
          {product.partner.websiteUrl ? (
            <a
              className="font-medium underline-offset-4 hover:underline"
              href={product.partner.websiteUrl}
              rel="noreferrer noopener"
              target="_blank"
            >
              {product.partner.name}
            </a>
          ) : (
            <p>{product.partner.name}</p>
          )}
          <p className="text-muted-foreground">{product.partner.shortDescription}</p>
        </section>
      ) : null}
    </article>
  );
}
