import { ArrowRight, Building2, Handshake } from 'lucide-react';
import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { PublicMediaImage } from '@/components/media/public-media-image';
import { createProductDetailPath } from '@/features/products/lib/create-product-detail-path';
import type { ProductResponse } from '@/generated/public-product.contract';

type ProductListItemProps = {
  readonly product: ProductResponse;
};

export function ProductListItem({ product }: ProductListItemProps): ReactElement {
  const detailPath = createProductDetailPath(product.id);
  return (
    <li>
      <Link
        className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        to={detailPath}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {product.imageMediaId ? (
            <PublicMediaImage
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              mediaId={product.imageMediaId}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <svg
                aria-hidden="true"
                className="h-12 w-12 opacity-30"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
            {product.category.name}
          </span>
          {product.partner ? (
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg backdrop-blur-sm">
              <Handshake aria-hidden="true" className="h-4 w-4" />
              {product.partner.name}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h2 className="text-base font-semibold leading-snug">{product.name}</h2>
          <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{product.shortDescription}</p>
          {product.manufacturer ? (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              <Building2 aria-hidden="true" className="h-3 w-3" />
              {product.manufacturer}
            </span>
          ) : null}
          <span className="mt-1 flex items-center gap-1 text-sm font-medium text-primary">
            View details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </li>
  );
}
