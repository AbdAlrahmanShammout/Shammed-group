/**
 * Accepted input formats for uploaded images.
 * Non-GIF formats are converted to WebP during processing.
 * GIF files are stored as-is to preserve animation.
 */
export const ALLOWED_IMAGE_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
  'image/gif': ['.gif'],
} as const;

export type AllowedImageMimeType = keyof typeof ALLOWED_IMAGE_MIME_TYPES;

export const OUTPUT_IMAGE_MIME_TYPE = 'image/webp' as const;
export const OUTPUT_IMAGE_EXTENSION = '.webp' as const;

/**
 * MIME types that must be stored as-is without any processing.
 * GIF is passthrough because animation frames must not be lost.
 */
export const PASSTHROUGH_MIME_TYPES: ReadonlySet<string> = new Set(['image/gif']);
