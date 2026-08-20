import type { ReactElement } from 'react';

import { PublicMediaImage } from '@/components/media/public-media-image';
import { cn } from '@/lib/utils';

type LogoMediaFrameProps = {
  readonly alt: string;
  readonly className?: string;
  readonly mediaId: number;
  readonly size?: 'md' | 'lg';
};

/**
 * Neutral logo presentation frame for public partner surfaces.
 */
export function LogoMediaFrame({
  alt,
  className,
  mediaId,
  size = 'md',
}: LogoMediaFrameProps): ReactElement {
  return (
    <div
      className={cn(
        'flex w-full items-center justify-center rounded-xl border border-border/70 bg-background px-6 shadow-[inset_0_1px_0_oklch(1_0_0_/_0.4)]',
        size === 'md' ? 'h-28' : 'h-36',
        className,
      )}
    >
      <PublicMediaImage
        alt={alt}
        className={cn(
          'w-auto max-w-[85%] object-contain',
          size === 'md' ? 'max-h-16' : 'max-h-24',
        )}
        mediaId={mediaId}
      />
    </div>
  );
}
