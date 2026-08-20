import type { ReactElement } from 'react';

import type { SocialLinkResponse } from '@/generated/public-site.contract';
import { focusRingClassName } from '@/lib/a11y/focus-ring-class-name';
import { cn } from '@/lib/utils';

type ContactSocialLinksProps = {
  readonly socialLinks: readonly SocialLinkResponse[];
};

export function ContactSocialLinks({ socialLinks }: ContactSocialLinksProps): ReactElement {
  return (
    <section aria-labelledby="contact-social-title" className="flex flex-col gap-4">
      <h2 className="text-2xl font-medium" id="contact-social-title">
        Social media
      </h2>
      {socialLinks.length === 0 ? (
        <p role="status">No social links are available yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {socialLinks.map((socialLink) => (
            <li key={socialLink.id}>
              <a
                className={cn('text-muted-foreground hover:text-foreground', focusRingClassName)}
                href={socialLink.url}
                rel="noreferrer noopener"
                target="_blank"
              >
                {socialLink.platform}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
