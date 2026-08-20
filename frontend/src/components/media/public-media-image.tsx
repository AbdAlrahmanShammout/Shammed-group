import type { ReactElement } from 'react';

import { createPublicMediaUrl } from '@/lib/create-public-media-url';
import { cn } from '@/lib/utils';

type PublicMediaImageProps = {
  readonly alt: string;
  readonly className?: string;
  readonly loading?: 'eager' | 'lazy';
  readonly mediaId: number;
};

/**
 * Renders a public media image from GET /media/:id.
 */
export function PublicMediaImage({
  alt,
  className,
  loading = 'lazy',
  mediaId,
}: PublicMediaImageProps): ReactElement {
  return (
    <img
      alt={alt}
      className={cn('max-w-full object-cover', className)}
      decoding="async"
      loading={loading}
      src={createPublicMediaUrl(mediaId)}
    />
  );
}
