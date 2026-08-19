export const ALLOWED_IMAGE_MIME_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
} as const;

export type AllowedImageMimeType = keyof typeof ALLOWED_IMAGE_MIME_TYPES;
