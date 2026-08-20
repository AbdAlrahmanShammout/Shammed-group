import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { appPaths } from '@/config/app-paths';
import type { HomePageResponse, PublicProductResponse } from '@/generated/public-home.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type HomeProductsSectionProps = {
  readonly homePage: HomePageResponse;
  readonly products: readonly PublicProductResponse[];
};

export function HomeProductsSection({ homePage, products }: HomeProductsSectionProps): ReactElement {
  return (
    <section aria-labelledby="home-products-title" className="border-b">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-medium" id="home-products-title">
            {homePage.productsSectionTitle}
          </h2>
          {homePage.productsSectionDescription ? (
            <p className="max-w-3xl text-muted-foreground">{homePage.productsSectionDescription}</p>
          ) : null}
          <Link
            className={cn(
              'text-sm font-medium text-foreground underline-offset-4 hover:underline',
              focusRingClassName,
            )}
            to={appPaths.products}
          >
            View all products
          </Link>
        </div>
        {products.length === 0 ? (
          <p role="status">No products are available yet.</p>
        ) : (
          <ul className="grid gap-8 md:grid-cols-2">
            {products.map((product) => (
              <li className="flex flex-col gap-2" key={product.id}>
                <h3 className="text-xl font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category.name}</p>
                <p className="text-muted-foreground">{product.shortDescription}</p>
                {product.manufacturer ? (
                  <p className="text-sm text-muted-foreground">Manufacturer: {product.manufacturer}</p>
                ) : null}
                {product.partner ? (
                  <p className="text-sm text-muted-foreground">Partner: {product.partner.name}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
