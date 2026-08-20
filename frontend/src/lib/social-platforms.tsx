import {
  siFacebook,
  siGithub,
  siInstagram,
  siTelegram,
  siTiktok,
  siWhatsapp,
  siX,
  siYoutube,
} from 'simple-icons';
import type { ReactElement } from 'react';

export type SocialPlatformKey =
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'x'
  | 'youtube'
  | 'whatsapp'
  | 'telegram'
  | 'tiktok'
  | 'github';

type SimpleIconDef = {
  readonly path: string;
  readonly hex: string;
  readonly title: string;
};

type IconProps = {
  readonly className?: string;
};

function SimpleIcon({ icon, className }: { readonly icon: SimpleIconDef; readonly className?: string }): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={icon.path} />
    </svg>
  );
}

/** LinkedIn path — not in simple-icons due to brand restrictions; using the canonical public path. */
const linkedInPath =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.605 0 4.266 2.372 4.266 5.456v6.285zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

function LinkedInIcon({ className }: IconProps): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={linkedInPath} />
    </svg>
  );
}

export type SocialPlatform = {
  readonly key: SocialPlatformKey;
  readonly label: string;
  readonly brandHex: string;
  readonly icon: (props: IconProps) => ReactElement;
};

export const SOCIAL_PLATFORMS: readonly SocialPlatform[] = [
  {
    key: 'facebook',
    label: 'Facebook',
    brandHex: `#${siFacebook.hex}`,
    icon: ({ className }) => <SimpleIcon className={className} icon={siFacebook} />,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    brandHex: `#${siInstagram.hex}`,
    icon: ({ className }) => <SimpleIcon className={className} icon={siInstagram} />,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    brandHex: '#0A66C2',
    icon: ({ className }) => <LinkedInIcon className={className} />,
  },
  {
    key: 'x',
    label: 'X (Twitter)',
    brandHex: `#${siX.hex}`,
    icon: ({ className }) => <SimpleIcon className={className} icon={siX} />,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    brandHex: `#${siYoutube.hex}`,
    icon: ({ className }) => <SimpleIcon className={className} icon={siYoutube} />,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    brandHex: `#${siWhatsapp.hex}`,
    icon: ({ className }) => <SimpleIcon className={className} icon={siWhatsapp} />,
  },
  {
    key: 'telegram',
    label: 'Telegram',
    brandHex: `#${siTelegram.hex}`,
    icon: ({ className }) => <SimpleIcon className={className} icon={siTelegram} />,
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    brandHex: `#${siTiktok.hex}`,
    icon: ({ className }) => <SimpleIcon className={className} icon={siTiktok} />,
  },
  {
    key: 'github',
    label: 'GitHub',
    brandHex: `#${siGithub.hex}`,
    icon: ({ className }) => <SimpleIcon className={className} icon={siGithub} />,
  },
];

export const SOCIAL_PLATFORM_KEYS = SOCIAL_PLATFORMS.map((p) => p.key) as [
  SocialPlatformKey,
  ...SocialPlatformKey[],
];

export function findSocialPlatform(key: string): SocialPlatform | undefined {
  return SOCIAL_PLATFORMS.find((p) => p.key === key);
}
