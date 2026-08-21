import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Building2, Handshake } from 'lucide-react';
import { useMemo, useRef, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { ProgressiveImage } from '@/components/media/progressive-image';
import { Button } from '@/components/ui/button';
import { appPaths } from '@/config/app-paths';
import type {
  HomePageResponse,
  PublicProductCategoryResponse,
  PublicProductResponse,
} from '@/generated/public-home.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
   Constants & helpers
───────────────────────────────────────────────────────────────────────────── */

const FALLBACK_COLOR = '#394285';
const DARKENING_STRENGTH = 0.5;

type HslColor = {
  readonly hue: number;
  readonly saturation: number;
  readonly lightness: number;
};

type DarkCategoryAtmosphere = {
  readonly edgeShade: string;
  readonly deepShade: string;
  readonly focalShade: string;
  readonly glowShade: string;
};

function resolveColor(color: string | undefined): string {
  return color ?? FALLBACK_COLOR;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function hexToHsl(hex: string): HslColor {
  const red = parseInt(hex.slice(1, 3), 16) / 255;
  const green = parseInt(hex.slice(3, 5), 16) / 255;
  const blue = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  if (max === min) {
    return { hue: 0, saturation: 0, lightness: lightness * 100 };
  }
  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const hue =
    max === red
      ? (green - blue) / delta + (green < blue ? 6 : 0)
      : max === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4;
  return {
    hue: hue * 60,
    saturation: saturation * 100,
    lightness: lightness * 100,
  };
}

function toHslString({ hue, saturation, lightness }: HslColor): string {
  return `hsl(${Math.round(hue)} ${Math.round(saturation)}% ${Math.round(lightness)}%)`;
}

function createDarkerLightness(lightness: number, factor: number, maximum: number): number {
  if (lightness <= 1) {
    return 0;
  }
  const fullDarkLightness = clamp(Math.min(lightness - 1, lightness * factor, maximum), 0, 100);
  return fullDarkLightness + (lightness - fullDarkLightness) * (1 - DARKENING_STRENGTH);
}

function deriveDarkCategoryAtmosphere(hex: string): DarkCategoryAtmosphere {
  const color = hexToHsl(hex);
  const atmosphericSaturation = clamp(color.saturation * 1.08, 18, 88);
  const mutedSaturation = clamp(color.saturation * 0.92, 16, 72);
  return {
    edgeShade: toHslString({
      hue: color.hue,
      saturation: mutedSaturation,
      lightness: createDarkerLightness(color.lightness, 0.14, 10),
    }),
    deepShade: toHslString({
      hue: color.hue,
      saturation: atmosphericSaturation,
      lightness: createDarkerLightness(color.lightness, 0.22, 14),
    }),
    focalShade: toHslString({
      hue: color.hue,
      saturation: atmosphericSaturation,
      lightness: createDarkerLightness(color.lightness, 0.34, 20),
    }),
    glowShade: toHslString({
      hue: color.hue,
      saturation: atmosphericSaturation,
      lightness: createDarkerLightness(color.lightness, 0.5, 28),
    }),
  };
}

/** Estimate perceived luminance; returns true when the color is "light". */
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Derive unique categories from the product list (preserves displayOrder)
───────────────────────────────────────────────────────────────────────────── */

function deriveCategories(
  products: readonly PublicProductResponse[],
): PublicProductCategoryResponse[] {
  const seen = new Map<number, PublicProductCategoryResponse>();
  for (const product of products) {
    if (!seen.has(product.categoryId)) {
      seen.set(product.categoryId, product.category);
    }
  }
  return [...seen.values()].sort((a, b) => a.displayOrder - b.displayOrder);
}

/* ─────────────────────────────────────────────────────────────────────────────
   Product media placeholder / image
───────────────────────────────────────────────────────────────────────────── */

type ProductMediaProps = {
  readonly alt: string;
  readonly className?: string;
  readonly mediaId?: number;
  readonly accentColor: string;
};

function ProductMedia({
  alt,
  className,
  mediaId,
  accentColor,
}: ProductMediaProps): ReactElement {
  if (mediaId === undefined) {
    return (
      <div
        className={cn(
          'flex items-center justify-center px-6 text-center text-sm text-muted-foreground',
          className,
        )}
        style={{
          background: `radial-gradient(circle at 30% 20%, ${hexToRgba(accentColor, 0.08)} 0%, #F5F7FA 72%)`,
        }}
      >
        {alt}
      </div>
    );
  }
  return (
    <ProgressiveImage
      alt={alt}
      className={cn('transition-transform duration-500 ease-out group-hover:scale-[1.03]', className)}
      mediaId={mediaId}
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 54vw, 640px"
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Product tile
───────────────────────────────────────────────────────────────────────────── */

type ProductTileProps = {
  readonly product: PublicProductResponse;
  readonly featured?: boolean;
  readonly index: number;
  readonly shouldReduceMotion: boolean | null;
  readonly accentColor: string;
};

function ProductTile({
  product,
  featured = false,
  index,
  shouldReduceMotion,
  accentColor,
}: ProductTileProps): ReactElement {
  const href = `${appPaths.products}/${product.id}`;
  return (
    <motion.li
      animate={{ opacity: 1, y: 0 }}
      className={cn('list-none', featured && 'md:col-span-2')}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      transition={{
        duration: 0.4,
        delay: shouldReduceMotion ? 0 : index * 0.06,
        ease: 'easeOut',
      }}
    >
      <Link
        className={cn(
          'group relative flex h-full overflow-hidden rounded-2xl border border-border/70 bg-background',
          'shadow-xs transition-[border-color,box-shadow] duration-300',
          'hover:shadow-sm',
          focusRingClassName,
          featured ? 'flex-col md:min-h-[22rem] md:flex-row' : 'flex-col',
        )}
        style={{
          ['--accent' as string]: accentColor,
        }}
        to={href}
      >
        {/* Subtle left-edge accent bar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-[3px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ backgroundColor: accentColor }}
        />

        {/* Image area */}
        <div
          className={cn(
            'relative overflow-hidden bg-muted/30',
            featured
              ? 'aspect-[16/11] md:aspect-auto md:w-[54%] md:self-stretch'
              : 'aspect-[4/3]',
          )}
        >
          <ProductMedia
            accentColor={accentColor}
            alt={product.name}
            className="absolute inset-0 size-full"
            mediaId={product.imageMediaId}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-80 md:from-transparent"
          />
          {product.partner !== undefined ? (
            <span
              className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-sm"
              style={{ backgroundColor: accentColor }}
            >
              <Handshake aria-hidden="true" className="h-4 w-4" />
              {product.partner.name}
            </span>
          ) : null}
        </div>

        {/* Content area */}
        <div
          className={cn(
            'flex flex-1 flex-col justify-between gap-4 p-5 md:p-6',
            featured && 'md:w-[46%] md:justify-center md:p-8',
          )}
        >
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.category.name}
            </p>
            <h3
              className={cn(
                'font-medium tracking-tight text-foreground',
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
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                <Building2 aria-hidden="true" className="h-3 w-3" />
                {product.manufacturer}
              </span>
            ) : null}
          </div>
          <span
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors duration-300"
            style={{ color: accentColor }}
          >
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

/* ─────────────────────────────────────────────────────────────────────────────
   Category tabs — premium pill selector with sliding Framer Motion indicator
───────────────────────────────────────────────────────────────────────────── */

type CategoryTabsProps = {
  readonly categories: PublicProductCategoryResponse[];
  readonly activeCategoryId: number;
  readonly onSelect: (id: number) => void;
  readonly shouldReduceMotion: boolean | null;
};

function CategoryTabs({
  categories,
  activeCategoryId,
  onSelect,
  shouldReduceMotion,
}: CategoryTabsProps): ReactElement {
  const tabRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  return (
    <div
      aria-label="Product categories"
      className="relative inline-flex rounded-2xl bg-muted/50 p-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
      role="tablist"
    >
      {categories.map((category) => {
        const isActive = category.id === activeCategoryId;
        const activeColor = resolveColor(category.color);
        const useDarkText = isLightColor(activeColor);
        return (
          <button
            key={category.id}
            ref={(el) => {
              if (el) tabRefs.current.set(category.id, el);
              else tabRefs.current.delete(category.id);
            }}
            aria-controls={`category-panel-${category.id}`}
            aria-selected={isActive}
            className={cn(
              'relative z-10 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors duration-200',
              focusRingClassName,
              'outline-offset-2',
              isActive
                ? useDarkText
                  ? 'text-gray-900'
                  : 'text-white'
                : 'text-muted-foreground hover:text-foreground',
            )}
            id={`category-tab-${category.id}`}
            onClick={() => onSelect(category.id)}
            role="tab"
            type="button"
          >
            {isActive ? (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-xl shadow-sm"
                layoutId="category-tab-pill"
                style={{ backgroundColor: activeColor }}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 400, damping: 35 }
                }
              />
            ) : null}
            <span className="relative z-10">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main section
───────────────────────────────────────────────────────────────────────────── */

type HomeProductsSectionProps = {
  readonly homePage: HomePageResponse;
  readonly products: readonly PublicProductResponse[];
};

export function HomeProductsSection({
  homePage,
  products,
}: HomeProductsSectionProps): ReactElement {
  const shouldReduceMotion = useReducedMotion();
  const categories = useMemo(() => deriveCategories(products), [products]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const effectiveCategoryId = activeCategoryId ?? categories[0]?.id ?? null;
  const activeCategory = categories.find((c) => c.id === effectiveCategoryId);
  const activeColor = resolveColor(activeCategory?.color);
  const activeAtmosphere = useMemo(() => deriveDarkCategoryAtmosphere(activeColor), [activeColor]);

  const filteredProducts = useMemo(
    () => products.filter((p) => p.categoryId === effectiveCategoryId),
    [products, effectiveCategoryId],
  );

  const [featuredProduct, ...remainingProducts] = filteredProducts;

  return (
    <section
      aria-labelledby="home-products-title"
      className="relative isolate overflow-hidden bg-background pb-24"
    >
      {/* ── Dynamic color atmosphere ─────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Base shade — always darker than the selected category accent. */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : { backgroundColor: activeAtmosphere.edgeShade }
          }
          className="absolute inset-0"
          style={{ backgroundColor: activeAtmosphere.edgeShade }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Focal atmosphere — a richer dark tone that preserves the category hue. */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : { backgroundColor: activeAtmosphere.focalShade }
          }
          className="absolute left-1/2 top-1/2 h-[38rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: activeAtmosphere.focalShade,
            filter: 'blur(110px)',
            opacity: 0.72,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Edge depth and a subtle category-colored glow, both derived from the active color. */}
        <motion.div
          animate={shouldReduceMotion ? {} : { backgroundColor: activeAtmosphere.deepShade }}
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full"
          style={{
            backgroundColor: activeAtmosphere.deepShade,
            filter: 'blur(90px)',
            opacity: 0.78,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.div
          animate={shouldReduceMotion ? {} : { backgroundColor: activeAtmosphere.glowShade }}
          className="absolute -bottom-40 left-1/4 h-80 w-80 rounded-full"
          style={{
            backgroundColor: activeAtmosphere.glowShade,
            filter: 'blur(120px)',
            opacity: 0.34,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Fine grid pattern for depth */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-[0.025]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect fill="url(#grid)" height="100%" width="100%" />
        </svg>
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-20 md:px-6">

        {/* ── Section header ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <motion.div
              className="flex max-w-2xl flex-col gap-3"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.4 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={shouldReduceMotion ? {} : { backgroundColor: activeColor }}
                  className="h-px w-6 shrink-0"
                  style={{ opacity: 0.7 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
                <p
                  className="text-xs font-semibold uppercase tracking-[0.18em]"
                  style={{ color: 'rgba(255,255,255,0.68)' }}
                >
                  Product Portfolio
                </p>
              </div>
              <h2
                className="text-3xl font-medium tracking-tight text-white md:text-4xl"
                id="home-products-title"
              >
                {homePage.productsSectionTitle}
              </h2>
              {homePage.productsSectionDescription ? (
                <p className="text-base leading-relaxed text-white/70 md:text-lg">
                  {homePage.productsSectionDescription}
                </p>
              ) : null}
            </motion.div>
            <Button asChild className="self-start md:self-auto" variant="outline">
              <Link to={appPaths.products}>
                View all products
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>

          {/* ── Category tab selector ───────────────────────────────────── */}
          {categories.length > 1 ? (
            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              viewport={{ once: true }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            >
              <CategoryTabs
                activeCategoryId={effectiveCategoryId ?? 0}
                categories={categories}
                onSelect={setActiveCategoryId}
                shouldReduceMotion={shouldReduceMotion}
              />
            </motion.div>
          ) : null}
        </div>

        {/* ── Product grid with animated transitions ───────────────────── */}
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.p
              key="empty"
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              role="status"
              transition={{ duration: 0.25 }}
            >
              No products are available in this category yet.
            </motion.p>
          ) : (
            <motion.ul
              key={effectiveCategoryId}
              animate={{ opacity: 1 }}
              aria-label={`Products in ${activeCategory?.name ?? 'this category'}`}
              className="grid gap-5 md:grid-cols-2"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {featuredProduct ? (
                <ProductTile
                  accentColor={activeColor}
                  featured
                  index={0}
                  product={featuredProduct}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ) : null}
              {remainingProducts.map((product, index) => (
                <ProductTile
                  accentColor={activeColor}
                  index={index + 1}
                  key={product.id}
                  product={product}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* ── Bottom accent line colored by active category ────────────── */}
        <motion.div
          animate={shouldReduceMotion ? {} : { backgroundColor: activeColor }}
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-px w-24 -translate-x-1/2 opacity-30"
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </section>
  );
}
