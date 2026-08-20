import type { ReactElement } from 'react';
import { ImageIcon } from 'lucide-react';

import { PublicMediaImage } from '@/components/media/public-media-image';
import { cn } from '@/lib/utils';

type AdminListMediaThumbProps = {
  readonly alt: string;
  readonly mediaId?: number;
  readonly objectFit?: 'contain' | 'cover';
};

/**
 * Compact media thumbnail for admin reorderable list cards.
 */
export function AdminListMediaThumb({
  alt,
  mediaId,
  objectFit = 'cover',
}: AdminListMediaThumbProps): ReactElement {
  return (
    <div
      aria-hidden={mediaId === undefined}
      className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted"
    >
      {mediaId !== undefined ? (
        <PublicMediaImage
          alt={alt}
          className={cn('size-full', objectFit === 'contain' ? 'object-contain p-1' : 'object-cover')}
          mediaId={mediaId}
        />
      ) : (
        <ImageIcon aria-hidden="true" className="size-5 text-muted-foreground" />
      )}
    </div>
  );
}
