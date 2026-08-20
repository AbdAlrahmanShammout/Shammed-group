import type { ReactElement } from 'react';

import type { SocialLinkResponse } from '@/generated/public-site.contract';

type ContactSocialLinksProps = {
  readonly socialLinks: readonly SocialLinkResponse[];
};

export function ContactSocialLinks({ socialLinks }: ContactSocialLinksProps): ReactElement | null {
  if (socialLinks.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="contact-social-title" className="flex flex-col gap-4">
      <h2 className="text-2xl font-medium" id="contact-social-title">
        Social media
      </h2>
      <ul className="flex flex-col gap-2">
        {socialLinks.map((socialLink) => (
          <li key={socialLink.id}>
            <a
              className="text-muted-foreground hover:text-foreground"
              href={socialLink.url}
              rel="noreferrer noopener"
              target="_blank"
            >
              {socialLink.platform}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
