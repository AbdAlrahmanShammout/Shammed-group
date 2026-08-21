import { useState } from 'react';
import type { ReactElement } from 'react';

import { createPublicMediaUrl } from '@/lib/create-public-media-url';
import { cn } from '@/lib/utils';

type PublicMediaImageProps = {
  readonly alt: string;
  readonly className?: string;
  readonly loading?: 'eager' | 'lazy';
  readonly mediaId: number;
  /**
   * Responsive widths for the srcset attribute (e.g. [400, 800, 1200]).
   * When provided, the browser picks the best variant automatically.
   */
  readonly srcWidths?: readonly number[];
  /**
   * CSS sizes attribute — tells the browser the display width at each
   * breakpoint. Only meaningful when srcWidths is set.
   */
  readonly sizes?: string;
};

/**
 * Renders a public media image from GET /media/:id.
 * Fades in once loaded and silently hides on error (no broken-image icon).
 */
export function PublicMediaImage({
  alt,
  className,
  loading = 'lazy',
  mediaId,
  srcWidths,
  sizes,
}: PublicMediaImageProps): ReactElement {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const src = createPublicMediaUrl(mediaId);
  const srcSet = srcWidths
    ? srcWidths.map((w) => `${createPublicMediaUrl(mediaId, w)} ${w}w`).join(', ')
    : undefined;

  if (isError) {
    return (
      <span
        aria-hidden="true"
        className={cn('block', className)}
        role="presentation"
      />
    );
  }

  return (
    <img
      alt={alt}
      className={cn(
        'max-w-full object-cover transition-opacity duration-500',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
      decoding="async"
      loading={loading}
      onError={() => setIsError(true)}
      onLoad={() => setIsLoaded(true)}
      sizes={sizes}
      src={src}
      srcSet={srcSet}
    />
  );
}
