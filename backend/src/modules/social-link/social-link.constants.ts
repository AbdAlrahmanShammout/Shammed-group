export const SOCIAL_PLATFORM_KEYS = [
  'facebook',
  'instagram',
  'linkedin',
  'x',
  'youtube',
  'whatsapp',
  'telegram',
  'tiktok',
  'github',
] as const;

export type SocialPlatformKey = (typeof SOCIAL_PLATFORM_KEYS)[number];
