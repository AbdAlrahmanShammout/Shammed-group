import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import type { ReactElement } from 'react';

import { useImagePlaceholder } from '@/components/media/image-placeholder-context';
import { createPublicMediaUrl } from '@/lib/create-public-media-url';
import { cn } from '@/lib/utils';

const CONTENT_SRCWIDTHS = [400, 800, 1200, 1600] as const;

type ObjectFit = 'cover' | 'contain';

type ProgressiveImageProps = {
  readonly alt: string;
  /**
   * Applied to the outer wrapper element.
   * Controls layout dimensions, aspect ratio, and positioning.
   * Example: "aspect-[4/3] w-full" or "absolute inset-0 size-full"
   */
  readonly className?: string;
  readonly loading?: 'eager' | 'lazy';
  readonly mediaId: number;
  readonly objectFit?: ObjectFit;
  /**
   * CSS sizes attribute for responsive images.
   * Defaults to a sensible full-width-to-half-width progression.
   */
  readonly sizes?: string;
  /**
   * Override the default srcset widths.
   */
  readonly srcWidths?: readonly number[];
};

/**
 * Progressive content image with:
 * - Branded skeleton placeholder while loading
 * - Fade-in transition once the image is ready
 * - Silent error state — no broken-image icon shown to users
 * - srcset + sizes for responsive delivery
 *
 * Use this for product cards, service panels, hero images, and other
 * content images that benefit from a polished loading experience.
 * For small logos (header/footer) use PublicMediaImage directly.
 */
export function ProgressiveImage({
  alt,
  className,
  loading = 'lazy',
  mediaId,
  objectFit = 'cover',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px',
  srcWidths = CONTENT_SRCWIDTHS,
}: ProgressiveImageProps): ReactElement {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const customPlaceholderSrc = useImagePlaceholder();

  const src = createPublicMediaUrl(mediaId);
  const srcSet = srcWidths
    .map((w) => `${createPublicMediaUrl(mediaId, w)} ${w}w`)
    .join(', ');

  const isSkeletonVisible = !isLoaded && !isError;

  return (
    <span className={cn('relative block overflow-hidden', className)}>
      {/* Skeleton — visible while the image loads, then fades out */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-500',
          isSkeletonVisible ? 'opacity-100' : 'opacity-0',
        )}
      >
        {customPlaceholderSrc ? (
          /* Custom branded placeholder image (configurable from admin panel) */
          <img
            alt=""
            aria-hidden="true"
            className={cn(
              'h-full w-full object-contain p-6 opacity-20',
              'transition-opacity duration-500',
              isSkeletonVisible ? 'opacity-20' : 'opacity-0',
            )}
            loading="eager"
            src={customPlaceholderSrc}
          />
        ) : (
          /* Fallback gradient skeleton */
          <span className="absolute inset-0 animate-pulse bg-gradient-to-br from-secondary/80 via-secondary/40 to-muted" />
        )}
      </span>

      {isError ? (
        /* Silent error state — muted placeholder, no broken icon shown to visitors */
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-muted"
        >
          <ImageOff aria-hidden="true" className="h-6 w-6 text-muted-foreground/20" />
        </span>
      ) : (
        <img
          alt={alt}
          className={cn(
            'absolute inset-0 h-full w-full transition-opacity duration-500',
            objectFit === 'contain' ? 'object-contain' : 'object-cover',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )}
          decoding="async"
          loading={loading}
          onError={() => setIsError(true)}
          onLoad={() => setIsLoaded(true)}
          sizes={sizes}
          src={src}
          srcSet={srcSet}
        />
      )}
    </span>
  );
}
