import type { ReactElement } from 'react';
import { ArrowRight, ArrowUpRight, Building2, Handshake } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { PublicMediaImage } from '@/components/media/public-media-image';
import { Button } from '@/components/ui/button';
import { appPaths } from '@/config/app-paths';
import type { HomePageResponse, PublicProductResponse } from '@/generated/public-home.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type HomeProductsSectionProps = {
  readonly homePage: HomePageResponse;
  readonly products: readonly PublicProductResponse[];
};

type ProductMediaProps = {
  readonly alt: string;
  readonly className?: string;
  readonly mediaId?: number;
};

function ProductMedia({ alt, className, mediaId }: ProductMediaProps): ReactElement {
  if (mediaId === undefined) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#E8ECF7,#F5F7FA_72%)] px-6 text-center text-sm text-muted-foreground',
          className,
        )}
      >
        {alt}
      </div>
    );
  }
  return (
    <PublicMediaImage
      alt={alt}
      className={cn(
        'size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]',
        className,
      )}
      mediaId={mediaId}
    />
  );
}

function createProductHref(productId: number): string {
  return `${appPaths.products}/${productId}`;
}

type ProductTileProps = {
  readonly product: PublicProductResponse;
  readonly featured?: boolean;
  readonly index: number;
  readonly shouldReduceMotion: boolean | null;
};

function ProductTile({
  product,
  featured = false,
  index,
  shouldReduceMotion,
}: ProductTileProps): ReactElement {
  const href = createProductHref(product.id);
  return (
    <motion.li
      className={cn('list-none', featured && 'md:col-span-2')}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
      transition={{ duration: 0.4, delay: shouldReduceMotion ? 0 : index * 0.05 }}
      viewport={{ once: true, amount: 0.25 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
    >
      <Link
        className={cn(
          'group relative flex h-full overflow-hidden rounded-2xl border border-border/70 bg-background',
          'shadow-xs transition-[border-color,box-shadow,transform] duration-300',
          'hover:border-foreground/15 hover:shadow-sm',
          focusRingClassName,
          featured ? 'flex-col md:min-h-[22rem] md:flex-row' : 'flex-col',
        )}
        to={href}
      >
        <div
          className={cn(
            'relative overflow-hidden bg-muted/30',
            featured ? 'aspect-[16/11] md:aspect-auto md:w-[54%] md:self-stretch' : 'aspect-[4/3]',
          )}
        >
          <ProductMedia
            alt={product.name}
            className="absolute inset-0 size-full"
            mediaId={product.imageMediaId}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-80 md:from-transparent"
          />
          {product.partner !== undefined ? (
            <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg backdrop-blur-sm">
              <Handshake aria-hidden="true" className="h-4 w-4" />
              {product.partner.name}
            </span>
          ) : null}
        </div>
        <div
          className={cn(
            'flex flex-1 flex-col justify-between gap-4 p-5 md:p-6',
            featured && 'md:w-[46%] md:justify-center md:p-8',
          )}
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {product.category.name}
            </p>
            <h3
              className={cn(
                'font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground',
                featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl',
              )}
            >
              {product.name}
            </h3>
            <p
              className={cn(
                'leading-relaxed text-muted-foreground',
                featured ? 'line-clamp-4 text-base' : 'line-clamp-3 text-sm',
              )}
            >
              {product.shortDescription}
            </p>
            {product.manufacturer !== undefined ? (
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-background/60 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur-sm">
                <Building2 aria-hidden="true" className="h-3 w-3" />
                {product.manufacturer}
              </span>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-primary">
            View product
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </Link>
    </motion.li>
  );
}

export function HomeProductsSection({ homePage, products }: HomeProductsSectionProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();
  const [featuredProduct, ...remainingProducts] = products;
  return (
    <section
      aria-labelledby="home-products-title"
      className="border-b bg-[linear-gradient(180deg,#FFFFFF_0%,#E8ECF7_55%,#FFFFFF_100%)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
              Catalogue highlights
            </p>
            <h2 className="text-3xl font-medium tracking-tight md:text-4xl" id="home-products-title">
              {homePage.productsSectionTitle}
            </h2>
            {homePage.productsSectionDescription ? (
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {homePage.productsSectionDescription}
              </p>
            ) : null}
          </div>
          <Button asChild className="self-start md:self-auto" variant="outline">
            <Link to={appPaths.products}>
              View all products
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
        {products.length === 0 ? (
          <p role="status">No products are available yet.</p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {featuredProduct ? (
              <ProductTile
                featured
                index={0}
                product={featuredProduct}
                shouldReduceMotion={shouldReduceMotion}
              />
            ) : null}
            {remainingProducts.map((product, index) => (
              <ProductTile
                index={index + 1}
                key={product.id}
                product={product}
                shouldReduceMotion={shouldReduceMotion}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
