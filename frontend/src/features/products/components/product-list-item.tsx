import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { createProductDetailPath } from '@/features/products/lib/create-product-detail-path';
import type { ProductResponse } from '@/generated/public-product.contract';

type ProductListItemProps = {
  readonly product: ProductResponse;
};

export function ProductListItem({ product }: ProductListItemProps): ReactElement {
  return (
    <li className="flex flex-col gap-2 border-b py-8 last:border-b-0">
      <h2 className="text-2xl font-medium">
        <Link className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" to={createProductDetailPath(product.id)}>
          {product.name}
        </Link>
      </h2>
      <p className="text-sm text-muted-foreground">{product.category.name}</p>
      <p className="text-muted-foreground">{product.shortDescription}</p>
      {product.manufacturer ? (
        <p className="text-sm text-muted-foreground">Manufacturer: {product.manufacturer}</p>
      ) : null}
      {product.partner ? (
        <p className="text-sm text-muted-foreground">Partner: {product.partner.name}</p>
      ) : null}
    </li>
  );
}
