/**
 * Accepted input formats for uploaded images.
 * All formats are converted to WebP during processing.
 */
export const ALLOWED_IMAGE_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
} as const;

export type AllowedImageMimeType = keyof typeof ALLOWED_IMAGE_MIME_TYPES;

export const OUTPUT_IMAGE_MIME_TYPE = 'image/webp' as const;
export const OUTPUT_IMAGE_EXTENSION = '.webp' as const;
